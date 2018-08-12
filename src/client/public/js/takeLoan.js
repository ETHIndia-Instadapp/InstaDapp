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
var ethToDai = 400;

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
    daiFromLock = (percentDaiFromLock / 100) * totlePriceinDol;
    $('#daiFromLock').val(daiFromLock);
    $('#ethToLock').val(ethToLock);
});
