pragma solidity ^0.4.25;
import "./seroInterface.sol";
import "./Ownable.sol";

contract Treasury is Ownable, SeroInterface {
    constructor() public {}

    function() public payable {}

    function deposit() public payable {}

    function withdraw(string memory currency, uint256 amount) public onlyOwner {
        require(sero_send(msg.sender, currency, amount, "", ""));
    }
}
