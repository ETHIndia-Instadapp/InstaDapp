var UserNetwork;
if (typeof web3 !== 'undefined') {
    var web3 = new Web3(web3.currentProvider);
} else {
    popAlert("This dapp only works with https://metamask.io on Kovan Test Network. Do the needful to make the webpage functional.");
}

setInterval(function() {
    if (typeof web3 !== 'undefined') {
        userNetwork();
    }
}, 3000);

function userNetwork(updateBool) {
    web3.version.getNetwork((err, networkId) => {
        switch (networkId) {
            case "1":
                networkName = "main";
                break;
            case "3":
                networkName = "ropsten";
                break;
            case "4":
                networkName = "rinkeby";
                break;
            case "42":
                networkName = "kovan";
                break;
            default:
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
function ethNetCheck(dontNotify) {
    if (UserNetwork == 'kovan') {
        return true;
    } else {
        if (!dontNotify) {
            popAlert('The dapp only works on Kovan Ethereum Network. Connect to the Kovan Test Network in Metamask.');
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