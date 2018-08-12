Object.keys(coinsData)
    .sort()
    .forEach(function (key, i) {
    if (coinsData[key].rop) {
        var forClass = `${coinsData[key].id + 'ForColor'}`;
        var color = coinsData[key].color;
        var html = `<div class="selectCoinBox ${forClass}" onclick="funcToSelect('${coinsData[key].id}')">
                        <div class="logoNameBox">
                            <div class="logoBox">
                                <img src="color/${coinsData[key].id}.png" style="width:48px; height:48px">
                            </div>
                            <div class="nameCodeBox">
                                <div class="nameBox">${coinsData[key].name}</div>
                                <div class="nameToken">${coinsData[key].fullname}</div>
                            </div>
                        </div>
                    </div>`;
        
        if (key != "dai") {
            $(".coinSelectContainer").append(html);
        }
    }
});

function changeToken() {
    $('.coinSelectCover').show();
    $('.coinSelectCover').css('display', 'flex');
}

function funcToSelect(coin) {
    $('#imgForSell').attr("src", `color/${coin}.png`);
    $('#sellSymbol').text(coinsData[coin].name);
    $('#sellFullName').text(coinsData[coin].fullname);
    $('.coinSelectCover').hide();
    if (coin != 'eth') {
        coinDetail = kyber[coinsData[coin].kyber];
        coinOneName = coinsData[coin].name;
        coinOneFullName = coinsData[coin].fullname;
        coinOneId = coin;
        coinOneDecimal = coinDetail.decimals;
        coinOneAdd = coinDetail.contractAddress;
        coinOneContract = web3.eth.contract(tokensAbi).at(coinOneAdd);
        coinOneContract.balanceOf(account, function (err, res) {
            if (!err) {
                coinOneQtyInWei = String(res);
                coinOneQty = coinOneQtyInWei / (10 ** coinOneDecimal);
                console.log(coinOneQty);
                if (buySell == 1) {
                    $('.tokenQtyValue').text(`${coinOneQty.toFixed(8)} ${coinOneName}`);
                }
            } else {
                console.log(err);
            };
        });
    } else {
        coinDetail = "eth";
        coinOneName = "ETH";
        coinOneDecimal = 18;
        coinOneFullName = "Ethereum";
        coinOneId = "eth";
        coinOneAdd = ethAdd;
        ethBalance(account);
    }
    if (buySell == 1) {
        toggleOne();
    } else if (buySell == 0) {
        toggleZero();
    }
}

function ArrowIcon() {
    if (buySell == 0) {
        buySell = 1;
        toggleOne();
    } else if (buySell == 1) {
        buySell = 0;
        toggleZero();
    }
}

function toggleZero() {
    console.log(123);
    $('.tokenQtyBox').css('animation', 'outlineAnim 1s forwards 0s linear');
    setTimeout(function () {
        $('.tokenQtyBox').css('animation', 'none')
    }, 1000);
    $('.arrowTransform').css('transform', 'rotate(180deg)');
    if (coinTwoQty >= 0) {
        $('.tokenQtyValue').text(`${coinTwoQty.toFixed(8)} ${coinTwoName}`);
    }
    if (maxOneRate) {
        $('#coinTocoin').text(`1 ${coinTwoName} = ${maxOneRate.toFixed(6)} ${coinOneName}`);
    }
    getExpectedRate();
}

function toggleOne() {
    console.log(0989);
    $('.tokenQtyBox').css('animation', 'outlineAnim 1s forwards 0s linear');
    setTimeout(function () {
        $('.tokenQtyBox').css('animation', 'none')
    }, 1000);
    $('.arrowTransform').css('transform', 'rotate(0deg)');
    if (coinOneQty >= 0) {
        $('.tokenQtyValue').text(`${coinOneQty.toFixed(8)} ${coinOneName}`);
    }
    if (maxTwoRate) {
        $('#coinTocoin').text(`1 ${coinOneName} = ${maxTwoRate.toFixed(6)} ${coinTwoName}`);
    }
    getExpectedRate();
}

function getExpectedRate() {
    console.log(coinOneAdd, coinTwoAdd);
    var oneNum = 10 ** coinOneDecimal;
    mainKyberContract.getExpectedRate(coinOneAdd, coinTwoAdd, oneNum, function (err, res) {
        if (!err) {
            maxTwoRateInWei = String(res[0]);
            maxTwoRate = maxTwoRateInWei / 1000000000000000000;
            if (buySell == 1) {
                $('#coinTocoin').text(`1 ${coinOneName} = ${maxTwoRate.toFixed(6)} ${coinTwoName}`);
            }
        } else {
            console.log(err);
        };
    });
    var TwoNum = 10 ** coinTwoDecimal;
    mainKyberContract.getExpectedRate(coinTwoAdd, coinOneAdd, TwoNum, function (err, res) {
        if (!err) {
            maxOneRateInWei = String(res[0]);
            maxOneRate = maxOneRateInWei / 1000000000000000000;
            if (buySell == 0) {
                $('#coinTocoin').text(`1 ${coinTwoName} = ${maxOneRate.toFixed(6)} ${coinOneName}`);
            }
        } else {
            console.log(err);
        };
    });
}
toggleOne();


var coinOneValue = 0;
var coinTwoValue = 0;
$('.coinOneInput').on('input', function () {
    coinOneValue = $(this).val();
    coinTwoValue = (coinOneValue * maxTwoRate);
    if (coinOneValue > 0) {
        $('.coinTwoInput').val(coinTwoValue.toFixed(6));
    } else if (coinOneValue < 0) {
        $(this).val('');
    } else {
        $('.coinTwoInput').val('');
    }
});


// Coins input on trade section
$('.coinTwoInput').on('input', function () {
    coinTwoValue = $(this).val();
    coinOneValue = (coinTwoValue / maxTwoRate);
    if (coinTwoValue > 0) {
        $('.coinOneInput').val(coinOneValue.toFixed(6));
    } else if (coinOneValue < 0) {
        $(this).val('');
    } else {
        $('.coinOneInput').val('');
    }
});

var allowanceLimit = 2 ** 255;

function swapTokens() {
    if (networkID != 3) {
        return popAlert(`Swap / Trade function (Kyber Network) is only enables for Ropsten, until we move to Mainnet.`);
    }
    if (coinOneValue > 0 && coinTwoValue > 0) {
        if (buySell == 1) {
            if (coinOneValue <= coinOneQty) {
                var forDecimal = 10 ** coinOneDecimal;
                var coinSellQty = coinOneValue * forDecimal;
                var coinBuyQty = coinTwoValue * (10 ** 18);
                var coinMinQty = ((maxTwoRateInWei * 97) / 100).toFixed(0);
                if (coinOneId != 'eth') {
                    allowance(coinOneContract, coinOneAdd, coinSellQty, coinTwoAdd, coinBuyQty, coinMinQty);
                } else {
                    trade(coinOneAdd, coinSellQty, coinTwoAdd, account, coinMinQty, 0);
                }
            } else {
            }
        } else if (buySell == 0) {
            if (coinTwoValue <= coinTwoQty) {
                var forDecimal = 10 ** coinTwoDecimal;
                var coinSellQty = coinTwoValue * forDecimal;
                var coinBuyQty = coinOneValue * (10 ** 18);
                var coinMinQty = (maxOneRateInWei * 97) / 100;
                allowance(coinContract, coinTwoAdd, coinSellQty, coinOneAdd, coinBuyQty, coinMinQty);
            } else {
                console.log('QUANTITY ERROR');
            }
        }
    } else {
        console.log('QUANTITY ERROR');
    }
}

function allowance(coinContract, src, srcAmount, dest, maxDestAmount, minDestAmount) {
    coinContract.allowance(account, mainKyberAdd, function (err, res) {
        if (!err) {
            if (String(res) < srcAmount) {
                var payObj = {
                    gasPrice: 10000000000
                }
                coinContract.approve(mainKyberAdd, allowanceLimit, payObj, function (err, res) {
                    if (!err) {
                        trade(src, srcAmount, dest, account, minDestAmount, 0);
                    } else {
                        console.log(err);
                    };
                })
            } else {
                trade(src, srcAmount, dest, account, minDestAmount, 0);
            }
        } else {
            console.log(err);
        };
    })
}

function trade(src, srcAmount, dest, account, minDestAmount, walletId) {
    var payObj = {
        value: 0,
        gasPrice: 10000000000,
    }
    if (src == "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
        payObj.value = srcAmount
        if (dest == "0x4f3afec4e5a3f2a6a1a411def7d7dfe50ee057bf") {
            payObj.gas = 750000
        } else {
            payObj.gas = 330000
        }
    } else if (dest == "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
        if (src == "0x4f3afec4e5a3f2a6a1a411def7d7dfe50ee057bf") {
            payObj.gas = 870000
        } else {
            payObj.gas = 430000
        }
    } else {
        if (src == "0x4f3afec4e5a3f2a6a1a411def7d7dfe50ee057bf" || dest == "0x4f3afec4e5a3f2a6a1a411def7d7dfe50ee057bf") {
            payObj.gas = 1200000
        } else {
            payObj.gas = 760000
        }
    }
    mainKyberContract.trade(src, srcAmount, dest, account, 2 ** 200, minDestAmount, "0xa7615cd307f323172331865181dc8b80a2834324", payObj, function (err, res) {
        if (!err) {
        } else {
            console.log('TRANSACTION FAILED');
        };
    });
}