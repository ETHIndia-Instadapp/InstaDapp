function setEthRemain() {
    if (ethBal) {
        $('#ethRemainAfterLock').val(ethBal);
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
var percentDaiFromLock = 50;
var ethRemainAfterLock;
var totlePriceinDai;

$('#ethToLock').on('input', function () {
    if (ethToLock > ethBal) {
        ethToLock = ethBal;
        $('#ethToLock').val(ethToLock);
    }
    ethToLock = $(this).val();
    totlePriceinDai = ethToLock*ethToDai;
    daiFromLock = (percentDaiFromLock / 100) * totlePriceinDai;
    ethRemainAfterLock = ethBal - ethToLock;
    $('#daiFromLock').attr({"max": totlePriceinDai*0.66});
    $('#daiFromLock').val(daiFromLock);
    $('#ethRemainAfterLock').val(ethRemainAfterLock);
});

$('#daiFromLock').on('input', function () {
    daiFromLock =  $(this).val();
    percentDaiFromLock = (daiFromLock / totlePriceinDai)*100;
    $('#percentDaiFromLock').val(percentDaiFromLock);
});

$('#percentDaiFromLock').on('input', function () {
    percentDaiFromLock = $(this).val();
    daiFromLock = (percentDaiFromLock/100) * totlePriceinDai;
    $('#daiFromLock').val(daiFromLock);
});

$('#ethRemainAfterLock').on('input', function () {
    ethRemainAfterLock = $(this).val();
    ethToLock = ethBal - ethRemainAfterLock;
    totlePriceinDai = ethToLock * ethToDai;
    daiFromLock = (percentDaiFromLock / 100) * totlePriceinDai;
    $('#daiFromLock').val(daiFromLock);
    $('#ethToLock').val(ethToLock);
});

// var mainAdd = "0x3efe17f41266daff6d115f4ec883b0cedec9e117";
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

setTimeout(function() {
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
            var value = ((String(res)) / toDivide).toFixed(3);
            cdpEthLocked = value;
            $('#ethLocked').text(cdpEthLocked);
            editTopBar();
        } else {
        console.log(err);
        };
    });

    mainContract.GlobalWithdraw(function (err, res) {
        if (!err) {
            var value = ((String(res)) / toDivide).toFixed(3);
            cdpDaiTaken = value;
            $('#daiTaken').text(cdpDaiTaken);
            editTopBar();
        } else {
            console.log(err);
        };
    });

    mainContract.Loans(account, function (err, res) {
        if (!err) {
            lockedEth = ((String(res[0])) / toDivide).toFixed(3);
            withDrawnDai = ((String(res[1])) / toDivide).toFixed(3);
            avgEthPrice = String(res[2]);
            $('#payEthLocked').text(lockedEth);
            $('#payEthDai').text(avgEthPrice);
            $('#payDaiTaken').text(withDrawnDai);
            editTopBar();
        } else {
            console.log(err);
        };
    });
}, 5000);

function getLoan() {
    console.log(ethToLock*toDivide, daiFromLock*toDivide);
    var payObj = {
        value: ethToLock*toDivide,
        gas: 600000
    };
    mainContract.InitiateLoan(daiFromLock * toDivide, payObj, function (err, res) {
        if (!err) {

        } else {
            console.log(err);
        };
    });
}

var num = 0;
function editTopBar() {
    num++;
    if (num%4 == 0) {
        var daiAva = (cdpEthLocked * ethToDai) - cdpDaiTaken;
        var daiPercent = ((cdpDaiTaken / (cdpEthLocked * ethToDai))*100).toFixed(2);
        $('#availableDai').text(daiAva);
        $('#dilutionPercent').text(daiPercent+'%');
        $('#ethCurrentPrice').text(ethToDai+'$');
        $('#liquidationEdge').text(ethToDai*0.66);
        userDaiPercent = withDrawnDai / (lockedEth * ethToDai);
        console.log(userDaiPercent*100);
        if (userDaiPercent*100 > 55) {
            $('.riskStatus').text('High');
            $('.riskStatus').css('background-color', 'rgb(226, 31, 31)');
        } else if (45 < userDaiPercent * 100 < 66) {
            $('.riskStatus').text('Medium');
            $('.riskStatus').css('background-color', 'rgb(233, 236, 16)');
        } else {
            $('.riskStatus').text('Low');
            $('.riskStatus').css('background-color', 'rgb(45, 230, 45)');
        }
    }
}

