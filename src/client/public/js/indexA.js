var buySell = 1;
var ethBal;

function ethBalance(account) {
    web3.eth.getBalance(account, function (err, res) {
        if (!err) {
            coinOneQtyInWei = String(res);
            coinOneQty = coinOneQtyInWei / (10 ** coinOneDecimal);
            ethBal = coinOneQty;
            if (buySell == 1) {
                $('.tokenQtyValue').text(`${coinOneQty.toFixed(8)} ${coinOneName}`);
            }
            $('#topEthBal').text(`${coinOneName}: ${coinOneQty.toFixed(4)}`)
        } else {
            web3Error();
            console.error(err);
        };
    });
}

// hiding boxes in ropsten
var kyber = ropsData;

var onMain = false;
var connection = false;
var account;

var coinDetail = "eth";

var coinOneName = "ETH",
    coinOneFullName = "Ethereum",
    coinOneId = "eth";

var coinTwoName = "DAI",
    coinTwoFullName = "Dai",
    coinTwoId = "dai";

// eth token address for kyber
var ethAdd = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';


var maxOneRate,
    maxOneRateInWei,
    maxTwoRate,
    maxTwoRateInWei;

var coinOneQtyInWei,
    coinOneQty,
    coinOneDecimal = 18,
    coinTwoQtyInWei,
    coinTwoQty,
    coinTwoDecimal = 18;

var coinOneContract;
var coinOneAdd = ethAdd;
var coinTwoAdd = "0xaD6D458402F60fD3Bd25163575031ACDce07538D";
var coinContract = web3.eth.contract(tokensAbi).at(coinTwoAdd);


if (typeof web3 !== 'undefined') {
    var web3 = new Web3(web3.currentProvider);
    if (web3.currentProvider.isMetaMask === true || web3.currentProvider.isTrust === true) {
        web3.version.getNetwork((err, netId) => {
            if (netId == 1) {
                onMain = true;
            }
            connection = true;
            account = web3.eth.accounts[0];
            ethBalance(account);
            coinContract.balanceOf(account, function (err, res) {
                if (!err) {
                    coinTwoQtyInWei = String(res);
                    coinTwoQty = coinTwoQtyInWei/(10**coinTwoDecimal);
                    $('#topDaiBal').text(`${coinTwoName}: ${coinTwoQty.toFixed(4)}`)
                } else {
                    console.log(err);
                };
            });
        });
    } else {
        $('.yourAddr').text('Not found');
    }
}

// For defining expectedRate function from smart contract
var mainKyberAdd = '0x818E6FECD516Ecc3849DAf6845e3EC868087B755';
var mainKyberContract = web3.eth.contract(kyberMainABI).at(mainKyberAdd);
