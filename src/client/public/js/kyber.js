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
        
        $(".coinSelectContainer").append(html);
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
}

var buySell = 0;
function ArrowIcon() {
    if (buySell == 0) {
        $('.tokenQtyBox').css('animation', 'outlineAnim 1s forwards 0s linear');
        setTimeout(function () {
            $('.tokenQtyBox').css('animation', 'none')
        }, 1000);
        $('.arrowTransform').css('transform', 'rotate(0deg)');
        if (coinOneQty) {
            $('.tokenQtyValue').text(`${coinOneQty.toFixed(8)} ${coinOneName}`);
        }
        if (maxTwoRate) {
            $('#coinTocoin').text(`1 ${coinOneName} = ${maxTwoRate.toFixed(6)} ${coinTwoName}`);
        }
        console.log(maxTwoRate);
        buySell = 1;
    } else if (buySell == 1) {
        $('.tokenQtyBox').css('animation', 'outlineAnim 1s forwards 0s linear');
        setTimeout(function () {
            $('.tokenQtyBox').css('animation', 'none')
        }, 1000);
        $('.arrowTransform').css('transform', 'rotate(180deg)');
        if (coinTwoQty) {
            $('.tokenQtyValue').text(`${coinTwoQty.toFixed(8)} ${coinTwoName}`);
        }
        if (maxOneRate) {
            $('#coinTocoin').text(`1 ${coinTwoName} = ${maxOneRate.toFixed(6)} ${coinOneName}`);
        }
        console.log(maxOneRate);
        buySell = 0;
    }
}

var oneNum = 10 ** coinOneDecimal;
mainKyberContract.getExpectedRate(coinOneAdd, coinTwoAdd, oneNum, function (err, res) {
    if (!err) {
        maxTwoRateInWei = String(res[0]);
        maxTwoRate = maxTwoRateInWei / 1000000000000000000;
        $('.ethToToken').text(`1 ${coinOneName} = ${maxTwoRate.toFixed(6)} ${coinTwoName}`);
    } else {
        console.log(err);
    };
});

var TwoNum = 10 ** coinTwoDecimal;
mainKyberContract.getExpectedRate(coinTwoAdd, coinOneAdd, TwoNum, function (err, res) {
    if (!err) {
        maxOneRateInWei = String(res[0]);
        maxOneRate = maxOneRateInWei / 1000000000000000000;
    } else {
        console.log(err);
    };
});