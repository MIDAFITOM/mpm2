pragma solidity ^0.4.25;

import "./Strings.sol";

library JSON {
    function uintsToJson(string memory key, uint256[] vals)
        internal
        pure
        returns (string memory json)
    {
        Strings.Slice[] memory valParts = new Strings.Slice[](vals.length);
        for (uint256 i = 0; i < vals.length; i++) {
            valParts[i] = Strings.toSlice(Strings.uint2String(vals[i]));
        }
        string memory valsJson = Strings.concat(
            Strings.toSlice("["),
            Strings.toSlice(Strings.join(Strings.toSlice(","), valParts))
        );
        valsJson = Strings.concat(
            Strings.toSlice(valsJson),
            Strings.toSlice("]")
        );

        Strings.Slice[] memory parts = new Strings.Slice[](2);
        parts[0] = Strings.toSlice(key);
        parts[1] = Strings.toSlice(valsJson);

        json = Strings.join(Strings.toSlice(":"), parts);
    }

    function uintToJson(string memory key, uint256 val)
        internal
        pure
        returns (string memory json)
    {
        Strings.Slice[] memory parts = new Strings.Slice[](2);
        parts[0] = Strings.toSlice(key);
        parts[1] = Strings.toSlice(Strings.uint2String(val));

        json = Strings.join(Strings.toSlice(":"), parts);
    }

    function objectToJson(string memory key, string val)
        internal
        pure
        returns (string memory json)
    {
        Strings.Slice[] memory parts = new Strings.Slice[](2);
        parts[0] = Strings.toSlice(key);
        parts[1] = Strings.toSlice(val);

        json = Strings.join(Strings.toSlice(":"), parts);
    }

    function toJsonString(string memory key, string val)
        internal
        pure
        returns (string memory json)
    {
        Strings.Slice[] memory parts = new Strings.Slice[](2);
        parts[0] = Strings.toSlice(key);

        Strings.Slice[] memory strs = new Strings.Slice[](3);
        strs[0] = Strings.toSlice('"');
        strs[1] = Strings.toSlice(val);
        strs[2] = Strings.toSlice('"');
        parts[1] = Strings.toSlice(Strings.join(Strings.toSlice(""), strs));

        json = Strings.join(Strings.toSlice(":"), parts);
    }

    function toJsonMap(string[] memory vals)
        internal
        pure
        returns (string memory json)
    {
        Strings.Slice[] memory parts = new Strings.Slice[](vals.length);
        for (uint256 i = 0; i < vals.length; i++) {
            parts[i] = Strings.toSlice(vals[i]);
        }
        json = Strings.concat(
            Strings.toSlice("{"),
            Strings.toSlice(Strings.join(Strings.toSlice(","), parts))
        );
        json = Strings.concat(Strings.toSlice(json), Strings.toSlice("}"));
    }

    function toJsonList(string[] memory list)
        internal
        pure
        returns (string memory json)
    {
        Strings.Slice[] memory parts = new Strings.Slice[](list.length);
        for (uint256 i = 0; i < list.length; i++) {
            parts[i] = Strings.toSlice(list[i]);
        }
        json = Strings.concat(
            Strings.toSlice("["),
            Strings.toSlice(Strings.join(Strings.toSlice(","), parts))
        );
        json = Strings.concat(Strings.toSlice(json), Strings.toSlice("]"));
    }
}
