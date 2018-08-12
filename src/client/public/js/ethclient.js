var UserNetwork;
if (typeof web3 !== 'undefined') {
    var web3 = new Web3(web3.currentProvider);
} else {
    popAlert("This dapp only works with https://metamask.io on Kovan Test Network. Do the needful to make the webpage functional.");
}

var timepass = true;
setInterval(function() {
    console.log(timepass);
    if (timepass) {
        if (typeof web3 !== 'undefined') {
            userNetwork();
            timepass = false;
        }
    }
    if (web3Check(true) && ethNetCheck(true) && ethAddressCheck(true)) {
        populatePage();
    }
}, 3000);

function userNetwork(updateBool) {
    web3.version.getNetwork((err, networkId) => {
        switch (networkId) {
            case "1":
                networkName = "main";
                popAlert('The dapp only works on Kovan Ethereum Network. Connect to the Kovan Test Network in Metamask.');
                popAlert('For loaning (DAI CDP loan) switch to Kovan Ethereum Network and for swapping (Kyber Network) switch to ropsten');
                break;
            case "3":
                networkName = "ropsten";
                popAlert('For loaning (DAI CDP loan) switch to Kovan Ethereum Network. Here on ropsten use Kyber Swap.');
                break;
            case "4":
                networkName = "rinkeby";
                popAlert('For swapping (Kyber Network) switch to ropsten. Here on Kovan Take Loan.');
                break;
            case "42":
                networkName = "kovan";
                break;
            default:
                popAlert('For loaning (DAI CDP loan) switch to Kovan Ethereum Network and for swapping (Kyber Network) switch to ropsten');
                networkName = "unknown";
        }
        UserNetwork = networkName;
        populatePage();
    });
}

// web3 variable check
function web3Check(dontNotify) {
    if (typeof web3 !== 'undefined') {
        return true;
    } else {
        if (!dontNotify) {
            popAlert('Wanna start? To initiate the transaction, you’ll need a safe client like https://metamask.io.');
        }
        return false;
    }
}

// ethereum network check
var kovanSolution = true;
function ethNetCheck(dontNotify) {
    if (UserNetwork == 'kovan') {
        return true;
    } else {
        if (dontNotify) {
            if (kovanSolution) {
                // popAlert('The dapp only works on Kovan Ethereum Network. Connect to the Kovan Test Network in Metamask.');
                kovanSolution = false;
            }
        }
        return false;
    }
}

// metamask login check
function ethAddressCheck(dontNotify) {
    if (web3.eth.accounts[0]) {
        return true;
    } else {
        if (!dontNotify) {
            popAlert("You need to specify an ethereum address in Metamask to initiate the transaction. Looks like you're logged out.");
        }
        return false;
    }
}