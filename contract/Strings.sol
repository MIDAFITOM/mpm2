pragma solidity ^0.4.25;

library Strings {
    struct Slice {
        uint256 _len;
        uint256 _ptr;
    }

    function findNth(
        bytes str,
        bytes1 char,
        uint8 n
    ) public pure returns (uint256) {
        uint8 count = 0;
        for (uint256 i = 0; i < str.length; i++) {
            if (str[i] == char) {
                count++;
                if (count >= n) {
                    return i;
                }
            }
        }
        return 0;
    }

    function toSlice(string memory self) internal pure returns (Slice memory) {
        uint256 ptr;
        assembly {
            ptr := add(self, 0x20)
        }
        return Slice(bytes(self).length, ptr);
    }

    function str2Uint(bytes str) public pure returns (uint256) {
        uint256 num = 0;
        for (uint256 i = 0; i < str.length; i++) {
            num += (uint256(str[str.length - 1 - i]) - 48) * (10**i);
        }
        return num;
    }

    function stringToBytes(string memory source)
        internal
        pure
        returns (bytes32 result)
    {
        assembly {
            result := mload(add(source, 32))
        }
    }

    function equal(string memory a, string memory b)
        internal
        pure
        returns (bool)
    {
        if (bytes(a).length == 0 && bytes(b).length == 0) {
            return true;
        }

        if (bytes(a).length != bytes(b).length) {
            return false;
        } else {
            return stringToBytes(a) == stringToBytes(b);
        }
    }

    function uint2String(uint256 i) internal pure returns (string c) {
        if (i == 0) return "0";
        uint256 j = i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length - 1;
        while (i != 0) {
            bstr[k--] = bytes1(48 + (i % 10));
            i /= 10;
        }
        c = string(bstr);
    }

    function join(Slice memory self, Slice[] memory parts)
        internal
        pure
        returns (string memory)
    {
        if (parts.length == 0) return "";

        uint256 length = self._len * (parts.length - 1);
        for (uint256 i = 0; i < parts.length; i++) length += parts[i]._len;

        string memory ret = new string(length);
        uint256 retptr;
        assembly {
            retptr := add(ret, 32)
        }

        for (i = 0; i < parts.length; i++) {
            memcpy(retptr, parts[i]._ptr, parts[i]._len);
            retptr += parts[i]._len;
            if (i < parts.length - 1) {
                memcpy(retptr, self._ptr, self._len);
                retptr += self._len;
            }
        }

        return ret;
    }

    function memcpy(
        uint256 dest,
        uint256 src,
        uint256 len
    ) private pure {
        for (; len >= 32; len -= 32) {
            assembly {
                mstore(dest, mload(src))
            }
            dest += 32;
            src += 32;
        }

        uint256 mask = 256**(32 - len) - 1;
        assembly {
            let srcpart := and(mload(src), not(mask))
            let destpart := and(mload(dest), mask)
            mstore(dest, or(destpart, srcpart))
        }
    }

    function concat(Slice memory self, Slice memory other)
        internal
        pure
        returns (string memory)
    {
        string memory ret = new string(self._len + other._len);
        uint256 retptr;
        assembly {
            retptr := add(ret, 32)
        }
        memcpy(retptr, self._ptr, self._len);
        memcpy(retptr + self._len, other._ptr, other._len);
        return ret;
    }
}
