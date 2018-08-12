function setEthRemain() {
    if (ethBal) {
        $('#ethRemainAfterLock').val(ethBal.toFixed(2));
        $('#ethToLock').attr({"max": ethBal});
        $('#ethRemainAfterLock').attr({"max": ethBal});
    } else {
        setTimeout(function() {
            setEthRemain();
        }, 500);
    }
}
setEthRemain();
var ethToDai;

var ethToLock;
var daiFromLock;
var percentDaiFromLock = 33;
var ethRemainAfterLock;
var totlePriceinDai;

$('#ethToLock').on('input', function () {
    ethToLock = $(this).val();
    if (ethToLock > ethBal) {
        ethToLock = ethBal;
        $('#ethToLock').val(ethToLock.toFixed(2));
    }
    totlePriceinDai = ethToLock * ethToDai;
    daiFromLock = (percentDaiFromLock / 100) * totlePriceinDai;
    ethRemainAfterLock = ethBal - ethToLock;
    $('#daiFromLock').attr({"max": totlePriceinDai*0.5});
    $('#daiFromLock').val(daiFromLock.toFixed(2));
    $('#ethRemainAfterLock').val(ethRemainAfterLock.toFixed(2));
});

$('#daiFromLock').on('input', function () {
    daiFromLock =  $(this).val();
    percentDaiFromLock = (daiFromLock / totlePriceinDai)*100;
    $('#percentDaiFromLock').val(percentDaiFromLock.toFixed(2));
});

$('#percentDaiFromLock').on('input', function () {
    percentDaiFromLock = $(this).val();
    if (percentDaiFromLock > 50) {
        percentDaiFromLock = 50;
        $('#percentDaiFromLock').val(percentDaiFromLock.toFixed(0));
    }
    daiFromLock = (percentDaiFromLock/100) * totlePriceinDai;
    $('#daiFromLock').val(daiFromLock.toFixed(2));
});

// $('#ethRemainAfterLock').on('input', function () {
//     ethRemainAfterLock = $(this).val();
//     if (ethRemainAfterLock > ethBal) {
//         ethToLock = ethBal;
//         $('#ethRemainAfterLock').val(ethToLock);
//     }
//     ethToLock = ethBal - ethRemainAfterLock;
//     totlePriceinDai = ethToLock * ethToDai;
//     daiFromLock = (percentDaiFromLock / 100) * totlePriceinDai;
//     $('#daiFromLock').val(daiFromLock);
//     $('#ethToLock').val(ethToLock);
// });

var mainAdd = "0xA6E604cec48f9A6017Ca435507D65fe7aC31A309";
var mainContract = web3.eth.contract(abiTakeLoan).at(mainAdd);

var toDivide = 1000000000000000000;
var cdpEthLocked;
var cdpDaiTaken;
var cdpAvailableDai;
var cdpPercentDilution;
var userDaiPercent;

var lockedEth;
var withDrawnDai; 
var avgEthPrice;


function populatePage() {

    mainContract.getETHprice(function (err, res) {
        if (!err) {
            // $('#ethLocked').text(String(res));
            ethToDai = Number(res);
            editTopBar();
        } else {
            console.log(err);
        };
    });

    mainContract.GlobalLocked(function (err, res) {
        if (!err) {
            var value = ((String(res)) / toDivide).toFixed(2);
            cdpEthLocked = value;
            $('#ethLocked').text(cdpEthLocked);
            editTopBar();
        } else {
        console.log(err);
        };
    });

    mainContract.GlobalWithdraw(function (err, res) {
        if (!err) {
            var value = ((String(res)) / toDivide).toFixed(2);
            cdpDaiTaken = value;
            $('#daiTaken').text(cdpDaiTaken);
            editTopBar();
        } else {
            console.log(err);
        };
    });

    mainContract.Loans(account, function (err, res) {
        if (!err) {
            lockedEth = ((String(res[0])) / toDivide).toFixed(2);
            withDrawnDai = ((String(res[1])) / toDivide).toFixed(2);
            avgEthPrice = String(res[2]);
            $('#payEthLocked').text(lockedEth);
            $('#payEthDai').text(avgEthPrice);
            $('#payDaiTaken').text(withDrawnDai);
            editTopBar();
        } else {
            console.log(err);
        };
    });

}

function getLoan() {
    console.log(ethToLock * toDivide, daiFromLock * toDivide);
    var payObj = {
        value: ethToLock * toDivide,
        gas: 630000
    };
    mainContract.InitiateLoan(daiFromLock * toDivide, payObj, function (err, txHash) {
        popAlert(`Your transaction is sent to <a href='https://kovan.etherscan.io/tx/${txHash}' target="_blank">ethereum kovan network</a>. After confirmation, DAI Stable Coin will be issued to your ethereum address as a loan.`);
        if (!err) {
        } else {
            console.log(err);
        };
    });
}

var num = 0;
function editTopBar() {
    num++;
    if (num % 4 == 0) {
        var daiAva = (cdpEthLocked * ethToDai * 0.66) - cdpDaiTaken;
        var daiPercent = ((cdpDaiTaken / (cdpEthLocked * ethToDai))*100).toFixed(2);
        $('#availableDai').text(daiAva.toFixed(2));
        $('#dilutionPercent').text(daiPercent+'%');
        $('#ethCurrentPrice').text("$"+ethToDai);
        $('#liquidationEdge').text(ethToDai*0.66);
        userDaiPercent = withDrawnDai / (lockedEth * ethToDai);
        console.log(userDaiPercent*100);
        if (userDaiPercent*100 > 40) {
            $('.riskStatus').text('High');
            $('.riskStatus').css('background-color', 'rgb(226, 31, 31)');
        } else if (userDaiPercent*100 > 30 && userDaiPercent*100 < 40) {
            $('.riskStatus').text('Medium');
            $('.riskStatus').css('background-color', 'rgb(233, 236, 16)');
        } else {
            $('.riskStatus').text('Low');
            $('.riskStatus').css('background-color', 'rgb(45, 230, 45)');
        }
        $('.loader').hide();
    }
}


function payLoan() {
    popAlert(`This feature is not available. Coming soon. Stay Tight :)`);
}