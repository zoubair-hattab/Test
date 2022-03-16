// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 ;

contract StorgeName{

    string public testDapps ;
    string name;

    constructor() {
        testDapps = "Storge Name";
    }

    function getName() view public returns (string memory ) {
    return name;
    }

   function setName (string memory _name)public{
     require(bytes(_name).length > 0,"Your Name Is empty");
    name=_name;
   }  
}

