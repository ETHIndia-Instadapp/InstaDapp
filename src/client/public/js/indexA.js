// hiding boxes in ropsten
function forRopsten() {
    kyber = ropsData;
}

var onMain = false;
var account;

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

var coinOneAdd = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
var coinTwoAdd = "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359";
var coinContract = web3.eth.contract(tokensAbi).at(coinTwoAdd);;


if (typeof web3 !== 'undefined') {
    var web3 = new Web3(web3.currentProvider);
    if (web3.currentProvider.isMetaMask === true || web3.currentProvider.isTrust === true) {
        web3.version.getNetwork((err, netId) => {
            if (netId == 1) {
                onMain = true;
            }
            account = web3.eth.accounts[0];
            web3.eth.getBalance(account, function (err, res) {
                if (!err) {
                    coinOneQtyInWei = String(res);
                    coinOneQty = coinOneQtyInWei/(10**coinOneDecimal);
                    $('.tokenQtyValue').text(`${coinOneQty.toFixed(8)} ${coinOneName}`);
                } else {
                    web3Error();
                    var title = 'ERROR GETTING QUANTITY';
                    var content = `Unable to get quantity of ETH in your wallet`;
                    showAlert(title, content);
                    console.error(err);
                };
            });
            coinContract.balanceOf(account, function (err, res) {
                if (!err) {
                    coinTwoQtyInWei = String(res);
                    coinTwoQty = coinTwoQtyInWei/(10**coinTwoDecimal);
                    // $('.tokenQtyValue').text(`${coinOneQty.toFixed(8)} ${coinOneName}`);
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
