const TransportIPFS = require('./TransportIPFS');
TransportIPFS.IpfsIiifDb = require('ipfs-iiif-db');  //https://github.com/pgte/ipfs-iiif-db
const TransportHTTP = require('./TransportHTTP');
const Dweb = require('./Dweb');

// Utility packages (ours) Aand one-loners
//UNUSED: const makepromises = require('./utils/makepromises');
function delay(ms, val) { return new Promise(resolve => {setTimeout(() => { resolve(val); },ms)})}

//Comment out one of these next two lines
let transportclass = TransportIPFS;
//let transportclass = TransportHTTP

// Fake a browser like environment for some tests
const jsdom = require("jsdom");
const { JSDOM } = jsdom;        //TODO - figure out what this does, dont understand the Javascript
htmlfake = '<!DOCTYPE html><ul><li id="myList.0">Failed to load sb via StructuredBlock</li><li id="myList.1">Failed to load mb via MutableBlock</li><li id="myList.2">Failed to load sb via dwebfile</li><li id="myList.3">Failed to load mb via dwebfile</li></ul>';
const dom = new JSDOM(htmlfake);
//console.log("XXX@8",dom.window.document.getElementById("myList.0").textContent); // Before loading = "Failed to load sb via StructuredBlock"
document = dom.window.document;   // Note in JS can't see "document" like can in python



let verbose = false;
let sb;
let acl;
    // Note that this test setup is being mirror in test_ipfs.html
    transportclass.p_setup({}, verbose, {})
    .then((t) => {
        if (verbose) console.log("setup returned and transport set - including annoationList");
        Dweb.transport = t;
    })
    .then(() => transportclass.test(Dweb.transport, verbose))
    .then(() => Dweb.Block.test(verbose))
    .then(() => Dweb.KeyPair.test(verbose))
    .then(() => Dweb.AccessControlList.p_test(verbose))
    .then((newacl) => acl = newacl)
    /* - tests for later modules
    .then(() => Dweb.KeyChain.p_test(acl, verbose)) // depends on MutableBlock for test, though not for KeyChain itself
    .then(() => Dweb.StructuredBlock.test(document, verbose))
    .then((testobjs) => sb = testobjs.sb)
    .then(() => console.log("sb=",sb))
    .then(() => Dweb.MutableBlock.test(sb, verbose))
     */
    .then(() => console.log("delaying 10 secs"))
    .then(() => delay(10000))
    .then(()=>console.log("Completed test - running IPFS in background, hit Ctrl-C to exit"))
    .catch((err) => console.log("Test failed", err));


/* path tests not done ... old ones
 console.log("Now test path using dwebfile and sb =======");
 verbose=false;
 Dweb.p_dwebfile("sb", sburl, "langs/readme.md", ["p_elem", "myList.2", verbose, null]);
 console.log("Now test path using dwebfile and mb =======");
 Dweb.p_dwebfile("mb", mburl, "langs/readme.md", ["p_elem", "myList.3", verbose, null]);
 console.log("END testing previouslyworking()");

 */