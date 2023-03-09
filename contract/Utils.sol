pragma solidity ^0.4.25;

library Utils {
    function sameDay(
        uint256 timestamp1,
        uint256 timestamp2
    ) internal pure returns (bool) {
        return
            (timestamp1 + 72000) / 24 / 3600 ==
            (timestamp2 + 72000) / 24 / 3600;
    }

    function sameHour(
        uint256 timestamp1,
        uint256 timestamp2
    ) internal pure returns (bool) {
        return timestamp1 / 3600 == timestamp2 / 3600;
    }

    function sameTenMin(
        uint256 timestamp1,
        uint256 timestamp2
    ) internal pure returns (bool) {
        return timestamp1 / 600 == timestamp2 / 600;
    }

    function sameRound(
        uint256 timestamp1,
        uint256 timestamp2
    ) internal pure returns (bool) {
        // return sameDay(timestamp1, timestamp2);
        return sameHour(timestamp1, timestamp2);
    }

    function sameDay(
        uint256 timestamp1,
        uint256 timestamp2,
        uint256 oneDay,
        uint256 offset
    ) internal pure returns (bool) {
        return (timestamp1 + offset) / oneDay == (timestamp2 + offset) / oneDay;
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a < b) {
            return a;
        }
        return b;
    }

    function bytes32ToString(bytes32 x) internal pure returns (string) {
        uint256 charCount = 0;
        bytes memory bytesString = new bytes(32);
        for (uint256 j = 0; j < 32; j++) {
            bytes1 char = bytes1(bytes32(uint256(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            } else if (charCount != 0) {
                break;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }

    function isContract(address addr) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(addr)
        }
        return size > 0;
    }
}
