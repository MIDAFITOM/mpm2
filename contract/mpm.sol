pragma solidity ^0.4.25;

library strings {
    struct slice {
        uint256 _len;
        uint256 _ptr;
    }

    function memcpy(uint256 dest, uint256 src, uint256 len) private pure {
        for (; len >= 32; len -= 32) {
            assembly {
                mstore(dest, mload(src))
            }
            dest += 32;
            src += 32;
        }

        uint256 mask = 256 ** (32 - len) - 1;
        assembly {
            let srcpart := and(mload(src), not(mask))
            let destpart := and(mload(dest), mask)
            mstore(dest, or(destpart, srcpart))
        }
    }

    function toSlice(string memory self) internal pure returns (slice memory) {
        uint256 ptr;
        assembly {
            ptr := add(self, 0x20)
        }
        return slice(bytes(self).length, ptr);
    }

    function concat(
        slice memory self,
        slice memory other
    ) internal pure returns (string memory) {
        string memory ret = new string(self._len + other._len);
        uint256 retptr;
        assembly {
            retptr := add(ret, 32)
        }
        memcpy(retptr, self._ptr, self._len);
        memcpy(retptr + self._len, other._ptr, other._len);
        return ret;
    }

    function join(
        slice memory self,
        slice[] memory parts
    ) internal pure returns (string memory) {
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

    function stringToBytes(
        string memory source
    ) internal pure returns (bytes32 result) {
        assembly {
            result := mload(add(source, 32))
        }
    }

    function equal(
        string memory a,
        string memory b
    ) internal pure returns (bool) {
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
}

library JSON {
    function uintsToJson(
        string memory key,
        uint256[] vals
    ) internal pure returns (string memory json) {
        strings.slice[] memory valParts = new strings.slice[](vals.length);
        for (uint256 i = 0; i < vals.length; i++) {
            valParts[i] = strings.toSlice(strings.uint2String(vals[i]));
        }
        string memory valsJson = strings.concat(
            strings.toSlice("["),
            strings.toSlice(strings.join(strings.toSlice(","), valParts))
        );
        valsJson = strings.concat(
            strings.toSlice(valsJson),
            strings.toSlice("]")
        );

        strings.slice[] memory parts = new strings.slice[](2);
        parts[0] = strings.toSlice(key);
        parts[1] = strings.toSlice(valsJson);

        json = strings.join(strings.toSlice(":"), parts);
    }

    function uintToJson(
        string memory key,
        uint256 val
    ) internal pure returns (string memory json) {
        strings.slice[] memory parts = new strings.slice[](2);
        parts[0] = strings.toSlice(key);
        parts[1] = strings.toSlice(strings.uint2String(val));

        json = strings.join(strings.toSlice(":"), parts);
    }

    function toJsonString(
        string memory key,
        string val
    ) internal pure returns (string memory json) {
        strings.slice[] memory parts = new strings.slice[](2);
        parts[0] = strings.toSlice(key);

        strings.slice[] memory strs = new strings.slice[](3);
        strs[0] = strings.toSlice('"');
        strs[1] = strings.toSlice(val);
        strs[2] = strings.toSlice('"');
        parts[1] = strings.toSlice(strings.join(strings.toSlice(""), strs));

        json = strings.join(strings.toSlice(":"), parts);
    }

    function toJsonMap(
        string[] memory vals
    ) internal pure returns (string memory json) {
        strings.slice[] memory parts = new strings.slice[](vals.length);
        for (uint256 i = 0; i < vals.length; i++) {
            parts[i] = strings.toSlice(vals[i]);
        }
        json = strings.concat(
            strings.toSlice("{"),
            strings.toSlice(strings.join(strings.toSlice(","), parts))
        );
        json = strings.concat(strings.toSlice(json), strings.toSlice("}"));
    }

    function toJsonList(
        string[] memory list
    ) internal pure returns (string memory json) {
        strings.slice[] memory parts = new strings.slice[](list.length);
        for (uint256 i = 0; i < list.length; i++) {
            parts[i] = strings.toSlice(list[i]);
        }
        json = strings.concat(
            strings.toSlice("["),
            strings.toSlice(strings.join(strings.toSlice(","), parts))
        );
        json = strings.concat(strings.toSlice(json), strings.toSlice("]"));
    }
}

library SafeMath {
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b);

        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0);
        uint256 c = a / b;

        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a);
        uint256 c = a - b;

        return c;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a);

        return c;
    }
}

library Utils {
    function sameDay(uint256 day1, uint256 day2) internal pure returns (bool) {
        return (day1 + 72000) / 24 / 3600 == (day2 + 72000) / 24 / 3600;
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

contract Ownable {
    address public owner;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

contract SeroInterface {
    bytes32 private topic_sero_issueToken =
        0x3be6bf24d822bcd6f6348f6f5a5c2d3108f04991ee63e80cde49a8c4746a0ef3;
    bytes32 private topic_sero_balanceOf =
        0xcf19eb4256453a4e30b6a06d651f1970c223fb6bd1826a28ed861f0e602db9b8;
    bytes32 private topic_sero_send =
        0x868bd6629e7c2e3d2ccf7b9968fad79b448e7a2bfb3ee20ed1acbc695c3c8b23;
    bytes32 private topic_sero_currency =
        0x7c98e64bd943448b4e24ef8c2cdec7b8b1275970cfe10daf2a9bfa4b04dce905;

    function sero_msg_currency() internal returns (string) {
        bytes memory tmp = new bytes(32);
        bytes32 b32;
        assembly {
            log1(tmp, 0x20, sload(topic_sero_currency_slot))
            b32 := mload(tmp)
        }
        return Utils.bytes32ToString(b32);
    }

    function sero_issueToken(
        uint256 _total,
        string memory _currency
    ) internal returns (bool success) {
        bytes memory temp = new bytes(64);
        assembly {
            mstore(temp, _currency)
            mstore(add(temp, 0x20), _total)
            log1(temp, 0x40, sload(topic_sero_issueToken_slot))
            success := mload(add(temp, 0x20))
        }
        return;
    }

    function sero_balanceOf(
        string memory _currency
    ) internal view returns (uint256 amount) {
        bytes memory temp = new bytes(32);
        assembly {
            mstore(temp, _currency)
            log1(temp, 0x20, sload(topic_sero_balanceOf_slot))
            amount := mload(temp)
        }
        return;
    }

    function sero_send_token(
        address _receiver,
        string memory _currency,
        uint256 _amount
    ) internal returns (bool success) {
        return sero_send(_receiver, _currency, _amount, "", 0);
    }

    function sero_send(
        address _receiver,
        string memory _currency,
        uint256 _amount,
        string memory _category,
        bytes32 _ticket
    ) internal returns (bool success) {
        bytes memory temp = new bytes(160);
        assembly {
            mstore(temp, _receiver)
            mstore(add(temp, 0x20), _currency)
            mstore(add(temp, 0x40), _amount)
            mstore(add(temp, 0x60), _category)
            mstore(add(temp, 0x80), _ticket)
            log1(temp, 0xa0, sload(topic_sero_send_slot))
            success := mload(add(temp, 0x80))
        }
        return;
    }
}

interface CodeService {
    function encode(uint256 n) external view returns (string, string);

    function decode(string code) external view returns (uint256, bool);
}

contract MPM is Ownable, SeroInterface {
    using SafeMath for uint256;
    uint256 private constant levels = 10;
    uint256 private constant MAX_DYNAMIC_LEVELS = 20;
    string private constant EMPTY = "";
    string private constant SERO_CURRENCY = "SERO";
    string private constant TOKEN_CURRENCY = "MPMTOM";
    uint256 private constant MIN_AMOUNT = 1e19;
    uint256 private constant TEN_THOUSAND = 1e22;
    CodeService private codeService;
    Airdrop private airdrop;
    address private op;
    address private tech;

    struct Investor {
        uint256 id;
        uint256 parentId;
        uint256 directId;
        uint256 value;
        uint256 totalInvestment;
        uint256 staticReward;
        uint256 dynamicReward;
        uint256 dynamicDirectReward;
        uint256 collideReward;
        uint256 totalStaticReward;
        uint256 totalDynamicReward;
        uint256 totalCollideReward;
        uint256 totalDynamicDirectReward;
        uint256 staticTimestamp;
        uint256 totalWinReward;
        uint256 canWithdrawValue;
        uint256[] lValues;
        uint256[] rValues;
        uint256 lAmount;
        uint256 rAmount;
        uint256 lTotalAmount;
        uint256 rTotalAmount;
        string lchildsCode;
        string rchildsCode;
        uint256 dayRecommendAmount;
        uint256 dayReward;
        bool isLeft;
        uint256 updatedTimestamp;
    }

    Investor[] private investors;
    mapping(address => uint256) private indexes;
    uint256 private preTotalShare;
    uint256 private preRewardAmount;
    uint256 private totalShare;
    uint256 private lastUpdated;
    uint256 private triggerStaticNum = 20;
    uint256 private Apool;
    uint256 private Bpool;
    bool private isApool = true;

    uint256 private ApoolRate = 73;
    uint256 private BpoolRate = 18;
    uint256 private ApoolDailyRate = 5;
    uint256 private BpoolDailyRate = 20;
    uint256 private AToBRate = 50;
    uint256 private winPoolRate = 3;
    uint256 private incomeTimes = 2;
    uint256 private dynamicDailyRate = 10;
    uint256 private dynamicRate = 10;
    uint256 private collideRate = 10;

    uint256 private winnerPool;
    uint256 private preWinnerPool;
    uint256 private winnersLen;
    uint256 private preWinnersLen;
    uint256[] private winners = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    uint256[] private topSixList = [0, 0, 0, 0, 0, 0, 0];
    uint256[] private topSixAmountList = [0, 0, 0, 0, 0, 0, 0];
    uint256[] winnerRates = [100, 0, 0, 0, 0, 0];

    constructor(
        address initialOp,
        address initialTech,
        address initialCodeServiceAddr,
        address initialAirdrop
    ) public payable {
        op = initialOp;
        tech = initialTech;
        codeService = CodeService(initialCodeServiceAddr);
        airdrop = Airdrop(initialAirdrop);
        investors.push(
            Investor({
                id: 0,
                parentId: 0,
                directId: 0,
                value: 0,
                totalInvestment: 0,
                staticReward: 0,
                dynamicReward: 0,
                dynamicDirectReward: 0,
                collideReward: 0,
                totalStaticReward: 0,
                totalDynamicReward: 0,
                totalCollideReward: 0,
                totalDynamicDirectReward: 0,
                staticTimestamp: 0,
                totalWinReward: 0,
                canWithdrawValue: 0,
                lValues: new uint256[](0),
                rValues: new uint256[](0),
                lAmount: 0,
                rAmount: 0,
                lTotalAmount: 0,
                rTotalAmount: 0,
                lchildsCode: "",
                rchildsCode: "",
                dayRecommendAmount: 0,
                dayReward: 0,
                isLeft: true,
                updatedTimestamp: 0
            })
        );
    }

    function buyToken() public {
        uint256 index = indexes[msg.sender];
        require(index != 0);
        Investor storage self = investors[index];
        uint256 value = self.value.sub(self.totalStaticReward);
        require(value > 0);

        if (self.parentId > 0) {
            Investor storage current = self;
            uint256 height = 0;
            bool isLeft = self.isLeft;
            while (current.parentId != 0 && height < levels) {
                current = investors[current.parentId];
                if (isLeft) {
                    current.lValues[height] = 0;
                } else {
                    current.rValues[height] = 0;
                }
                isLeft = current.isLeft;
                height++;
            }
        }

        self.totalStaticReward = self.totalStaticReward.add(value);
        totalShare = totalShare.sub(value);
        require(sero_send(msg.sender, TOKEN_CURRENCY, value, "", ""));
    }

    function invest(
        string memory directCode,
        string memory code
    ) public payable {
        require(strings.equal(SERO_CURRENCY, sero_msg_currency()));
        require(msg.value >= MIN_AMOUNT);
        require(!Utils.isContract(msg.sender));

        uint256 index = indexes[msg.sender];
        Investor storage self = investors[index];
        Investor storage direct = investors[self.directId];

        if (index == 0) {
            require(!strings.equal(code, ""));
            register(code);
            index = indexes[msg.sender];

            (uint256 directIndex, ) = codeService.decode(directCode);
            require(directIndex > 0 && directIndex < index);
            direct = investors[directIndex];
            self = investors[index];
            self.directId = directIndex;
        }

        investValue(self, direct, msg.value);
    }

    function reinvest(uint256 reinvestValue) public {
        require(MIN_AMOUNT <= reinvestValue || reinvestValue == 0);
        uint256 index = indexes[msg.sender];
        require(index != 0);
        Investor storage self = investors[index];

        if (reinvestValue == 0) {
            reinvestValue = self.canWithdrawValue;
            require(MIN_AMOUNT <= reinvestValue);
        }

        require(self.canWithdrawValue >= reinvestValue);
        self.canWithdrawValue = self.canWithdrawValue.sub(reinvestValue);

        Investor storage direct = investors[self.directId];
        investValue(self, direct, reinvestValue);
    }

    function triggerStaticProfit() public {
        uint256 id = indexes[msg.sender];
        require(id != 0);

        _beforeUpdate();

        if (!isApool) {
            if (preTotalShare == 0 || preRewardAmount == 0) {
                return;
            }
        }

        for (
            uint256 i = id;
            i < Utils.min(investors.length, id + triggerStaticNum);
            i++
        ) {
            Investor storage self = investors[i];
            if (
                !Utils.sameDay(self.staticTimestamp, now) &&
                self.value > self.totalStaticReward
            ) {
                calceReward(self);
            }
        }
    }

    function withdraw() public {
        uint256 index = indexes[msg.sender];
        require(index != 0);

        Investor storage self = investors[index];
        uint256 value = self.canWithdrawValue;
        require(value > 0);

        self.canWithdrawValue = 0;
        require(sero_send_token(msg.sender, SERO_CURRENCY, value));
    }

    function withdrawAirdrop() public {
        uint256 index = indexes[msg.sender];
        require(index != 0);

        airdrop.withdrawTo(index, msg.sender);
    }

    function details() public returns (string json) {
        if (indexes[msg.sender] == 0) {
            return;
        }

        Investor storage self = investors[indexes[msg.sender]];

        updateReward(self);

        string[] memory vals = new string[](29);
        (string memory lcode, string memory rcode) = codeService.encode(
            self.id
        );
        (string memory lpcode, string memory rpcode) = codeService.encode(
            self.parentId
        );
        (string memory directLcode, ) = codeService.encode(self.directId);

        vals[0] = JSON.toJsonString('"lcode"', lcode);
        vals[1] = JSON.toJsonString('"rcode"', rcode);
        if (self.isLeft) {
            vals[2] = JSON.toJsonString(
                '"parentCode"',
                self.parentId == 0 ? '""' : lpcode
            );
            vals[24] = JSON.uintToJson('"isLeft"', 1);
        } else {
            vals[2] = JSON.toJsonString(
                '"parentCode"',
                self.parentId == 0 ? '""' : rpcode
            );
            vals[24] = JSON.uintToJson('"isLeft"', 0);
        }

        vals[3] = JSON.uintToJson('"value"', self.value);
        vals[4] = JSON.uintToJson('"totalInvestment"', self.totalInvestment);
        vals[5] = JSON.uintToJson(
            '"totalStaticReward"',
            self.totalStaticReward
        );
        vals[6] = JSON.uintToJson(
            '"totalDynamicReward"',
            self.totalDynamicReward
        );
        vals[7] = JSON.uintToJson(
            '"totalCollideReward"',
            self.totalCollideReward
        );
        vals[8] = JSON.uintToJson(
            '"totalDynamicDirectReward"',
            self.totalDynamicDirectReward
        );
        vals[9] = JSON.uintToJson('"staticTimestamp"', self.staticTimestamp);
        vals[10] = JSON.uintToJson('"totalWinReward"', self.totalWinReward);
        vals[11] = JSON.uintToJson('"canWithdrawValue"', self.canWithdrawValue);
        vals[12] = JSON.uintToJson('"lAmount"', self.lAmount);
        vals[13] = JSON.uintToJson('"rAmount"', self.rAmount);
        vals[14] = JSON.uintToJson('"lTotalAmount"', self.lTotalAmount);
        vals[15] = JSON.uintToJson('"rTotalAmount"', self.rTotalAmount);
        vals[16] = JSON.toJsonString('"lchildsCode"', self.lchildsCode);
        vals[17] = JSON.toJsonString('"rchildsCode"', self.rchildsCode);

        if (Utils.sameDay(self.staticTimestamp, now)) {
            vals[18] = JSON.uintToJson('"staticReward"', self.staticReward);
        } else {
            vals[18] = JSON.uintToJson(
                '"staticReward"',
                calcStaticReward(self)
            );
        }

        vals[19] = JSON.uintToJson('"dynamicReward"', self.dynamicReward);

        vals[20] = JSON.uintToJson('"collideReward"', self.collideReward);

        vals[21] = JSON.uintToJson(
            '"dynamicDirectReward"',
            self.dynamicDirectReward
        );
        vals[22] = JSON.uintToJson(
            '"dayRecommendAmount"',
            self.dayRecommendAmount
        );
        vals[23] = JSON.uintToJson('"dayReward"', self.dayReward);
        vals[25] = JSON.uintsToJson('"lValues"', self.lValues);
        vals[26] = JSON.uintsToJson('"rValues"', self.rValues);
        vals[27] = JSON.toJsonString('"directCode"', directLcode);
        vals[28] = JSON.uintToJson('"airdrop"', airdrop.balanceOf(self.id));

        json = JSON.toJsonMap(vals);
        return json;
    }

    function winnerList() public view returns (string json) {
        strings.slice[] memory preParts = new strings.slice[](preWinnersLen);
        uint256[] memory preValues = new uint256[](preWinnersLen);
        uint256[] memory preAmounts = new uint256[](preWinnersLen);
        for (uint256 i = 0; i < preWinnersLen; i++) {
            (string memory preLcode, ) = codeService.encode(winners[i * 2]);
            preParts[i] = strings.toSlice(preLcode);
            preValues[i] = winners[i * 2 + 1];
            preAmounts[i] = topSixAmountList[i];
        }

        strings.slice[] memory parts = new strings.slice[](winnersLen);
        uint256[] memory amounts = new uint256[](winnersLen);
        for (i = 0; i < winnersLen; i++) {
            (string memory lcode, ) = codeService.encode(topSixList[i]);
            parts[i] = strings.toSlice(lcode);
            amounts[i] = investors[topSixList[i]].dayRecommendAmount;
        }
        string[] memory vals = new string[](7);
        vals[0] = JSON.toJsonString(
            '"preCode"',
            strings.join(strings.toSlice(","), preParts)
        );
        vals[1] = JSON.toJsonString(
            '"code"',
            strings.join(strings.toSlice(","), parts)
        );
        vals[2] = JSON.uintsToJson('"preValues"', preValues);
        vals[3] = JSON.uintsToJson('"preAmounts"', preAmounts);
        vals[4] = JSON.uintsToJson('"amounts"', amounts);
        vals[5] = JSON.uintToJson('"preWinnerPool"', preWinnerPool);
        vals[6] = JSON.uintToJson('"winnerPool"', winnerPool);
        json = JSON.toJsonMap(vals);
        return;
    }

    function registerNode(address _addr) public onlyOwner {
        require(!Utils.isContract(_addr));
        uint256 index = investors.length;
        indexes[_addr] = index;
        investors.push(
            Investor({
                id: index,
                parentId: 0,
                directId: 0,
                value: 0,
                totalInvestment: 0,
                staticReward: 0,
                dynamicReward: 0,
                dynamicDirectReward: 0,
                collideReward: 0,
                totalStaticReward: 0,
                totalDynamicReward: 0,
                totalCollideReward: 0,
                totalDynamicDirectReward: 0,
                staticTimestamp: now,
                totalWinReward: 0,
                canWithdrawValue: 0,
                lValues: new uint256[](0),
                rValues: new uint256[](0),
                lAmount: 0,
                rAmount: 2e28,
                lTotalAmount: 0,
                rTotalAmount: 0,
                lchildsCode: "",
                rchildsCode: "",
                dayRecommendAmount: 0,
                dayReward: 0,
                isLeft: true,
                updatedTimestamp: now
            })
        );
    }

    function topSix(uint256 id) internal {
        if (winnersLen == 0) {
            winnersLen = 1;
            topSixList[0] = id;
        } else {
            uint256 index = 7;
            for (uint256 i = 0; i < winnersLen; i++) {
                if (id == topSixList[i]) {
                    index = i;
                }
            }

            if (index == 7) {
                topSixList[winnersLen] = id;
                index = winnersLen;

                if (winnersLen < 6) {
                    winnersLen++;
                }
            }

            for (i = index; i > 0; i--) {
                if (
                    investors[topSixList[i]].dayRecommendAmount >
                    investors[topSixList[i - 1]].dayRecommendAmount
                ) {
                    uint256 temp = topSixList[i];
                    topSixList[i] = topSixList[i - 1];
                    topSixList[i - 1] = temp;
                } else {
                    break;
                }
            }
        }
    }

    function _beforeUpdate() internal {
        if (!Utils.sameDay(now, lastUpdated)) {
            if (Apool < Bpool.mul(AToBRate).div(100)) {
                isApool = false;
            } else {
                isApool = true;
            }

            preRewardAmount = Apool.add(Bpool).mul(BpoolDailyRate).div(1000);

            preTotalShare = totalShare;

            preWinnersLen = winnersLen;
            preWinnerPool = winnerPool;
            if (winnersLen > 0) {
                uint256 winnerProfit = winnerPool.div(20);
                uint256 allProfit;
                for (uint256 i = 0; i < winnersLen; i++) {
                    uint256 winProfit = winnerProfit.mul(winnerRates[i]).div(
                        100
                    );
                    investors[topSixList[i]].totalWinReward = investors[
                        topSixList[i]
                    ].totalWinReward.add(winProfit);
                    investors[topSixList[i]].canWithdrawValue = investors[
                        topSixList[i]
                    ].canWithdrawValue.add(winProfit);
                    allProfit = allProfit.add(winProfit);
                    winners[i * 2] = topSixList[i];
                    winners[i * 2 + 1] = winProfit;
                    topSixAmountList[i] = investors[topSixList[i]]
                        .dayRecommendAmount;
                    investors[topSixList[i]].dayRecommendAmount = 0;
                }

                topSixList = [0, 0, 0, 0, 0, 0, 0];
                winnerPool = winnerPool.sub(allProfit);
                winnersLen = 0;
            }

            lastUpdated = now;
        }
    }

    function updateReward(Investor storage self) internal {
        if (!Utils.sameDay(now, self.updatedTimestamp)) {
            self.dynamicReward = 0;

            self.totalStaticReward = self.totalStaticReward.add(
                self.collideReward
            );
            self.canWithdrawValue = self.canWithdrawValue.add(
                self.collideReward
            );
            airdrop.addPerf(self.id, self.collideReward);
            self.collideReward = 0;
            self.dynamicDirectReward = 0;
            self.dayReward = 0;
            self.updatedTimestamp = now;
        }
    }

    function calcStaticReward(
        Investor storage self
    ) internal view returns (uint256 value) {
        if (
            Utils.sameDay(self.staticTimestamp, now) && self.staticReward != 0
        ) {
            return self.staticReward;
        }
        if (isApool) {
            value = self
                .value
                .sub(self.totalStaticReward)
                .mul(ApoolDailyRate)
                .div(1000);
        } else {
            if (preRewardAmount == 0 || preTotalShare == 0) {
                return 0;
            }

            value = self
                .value
                .sub(self.totalStaticReward)
                .mul(preRewardAmount)
                .div(preTotalShare);
        }

        if (value.add(self.totalStaticReward) > self.value) {
            value = self.value.sub(self.totalStaticReward);
        }
    }

    function payStaticReward(
        Investor storage self
    ) internal returns (uint256 value) {
        updateReward(self);
        value = calcStaticReward(self);
        value = payProfit(self, value);
        self.staticTimestamp = now;
        if (value == 0) {
            return 0;
        }

        if (self.parentId > 0) {
            Investor storage current = self;
            uint256 height = 0;
            bool isLeft = self.isLeft;
            while (current.parentId != 0 && height < levels) {
                current = investors[current.parentId];
                if (isLeft) {
                    current.lValues[height] = current.lValues[height] < value
                        ? 0
                        : current.lValues[height].sub(value);
                } else {
                    current.rValues[height] = current.rValues[height] < value
                        ? 0
                        : current.rValues[height].sub(value);
                }
                isLeft = current.isLeft;
                height++;
            }
        }

        self.staticReward = value;
        self.totalStaticReward = self.totalStaticReward.add(value);
        self.canWithdrawValue = self.canWithdrawValue.add(value);
        totalShare = totalShare.sub(value);
    }

    function payDynamicReward(Investor storage self, uint256 reward) internal {
        updateReward(self);
        uint256 value;
        if (self.totalInvestment < 1e23) {
            uint256 myReward = calcStaticReward(self);
            value = Utils.min(
                reward.mul(dynamicDailyRate).div(100),
                myReward.mul(dynamicDailyRate).div(100)
            );
        } else {
            value = reward.mul(dynamicDailyRate).div(100);
        }

        value = payProfit(self, value);

        self.dynamicReward = self.dynamicReward.add(value);
        self.totalDynamicReward = self.totalDynamicReward.add(value);

        self.totalStaticReward = self.totalStaticReward.add(value);
        self.canWithdrawValue = self.canWithdrawValue.add(value);
    }

    function calceReward(Investor storage self) internal {
        uint256 reward = payStaticReward(self);
        if (reward == 0) {
            return;
        }

        Investor storage current = self;
        uint256 height = 1;

        while (current.directId != 0 && height <= MAX_DYNAMIC_LEVELS) {
            current = investors[current.directId];
            uint256 values = current.totalInvestment;
            if (
                getDynamicLevel(values) >= height &&
                current.totalStaticReward < current.value
            ) {
                payDynamicReward(current, reward);
            }
            height++;
        }
    }

    function payProfit(
        Investor storage self,
        uint256 amount
    ) internal returns (uint256) {
        if (self.dayReward >= self.totalInvestment) {
            return 0;
        }

        if (amount.add(self.dayReward) > self.totalInvestment) {
            amount = self.totalInvestment.sub(self.dayReward);
        }

        if (Apool > amount) {
            Apool = Apool.sub(amount);
        } else {
            Bpool = Bpool.sub(amount);
        }

        self.dayReward = self.dayReward.add(amount);
        return amount;
    }

    function register(string memory code) internal {
        (uint256 parentIndex, bool isLeft) = codeService.decode(code);
        require(parentIndex > 0 && parentIndex < investors.length);

        Investor storage parent = investors[parentIndex];
        uint256 index = investors.length;
        (string memory lchildsCode, string memory rchildsCode) = codeService
            .encode(index);

        if (isLeft) {
            if (strings.equal(EMPTY, parent.lchildsCode)) {
                parent.lchildsCode = lchildsCode;
            } else {
                parent.lchildsCode = strings.concat(
                    strings.toSlice(
                        strings.concat(
                            strings.toSlice(parent.lchildsCode),
                            strings.toSlice(" ")
                        )
                    ),
                    strings.toSlice(lchildsCode)
                );
            }
        } else {
            if (strings.equal(EMPTY, parent.rchildsCode)) {
                parent.rchildsCode = rchildsCode;
            } else {
                parent.rchildsCode = strings.concat(
                    strings.toSlice(
                        strings.concat(
                            strings.toSlice(parent.rchildsCode),
                            strings.toSlice(" ")
                        )
                    ),
                    strings.toSlice(rchildsCode)
                );
            }
        }

        indexes[msg.sender] = index;
        investors.push(
            Investor({
                id: index,
                parentId: parentIndex,
                directId: 0,
                value: 0,
                totalInvestment: 0,
                staticReward: 0,
                dynamicReward: 0,
                dynamicDirectReward: 0,
                collideReward: 0,
                totalStaticReward: 0,
                totalDynamicReward: 0,
                totalCollideReward: 0,
                totalDynamicDirectReward: 0,
                staticTimestamp: now,
                totalWinReward: 0,
                canWithdrawValue: 0,
                lValues: new uint256[](0),
                rValues: new uint256[](0),
                lAmount: 0,
                rAmount: 0,
                lTotalAmount: 0,
                rTotalAmount: 0,
                lchildsCode: "",
                rchildsCode: "",
                dayRecommendAmount: 0,
                dayReward: 0,
                isLeft: isLeft,
                updatedTimestamp: now
            })
        );
    }

    function collide(
        Investor storage self,
        uint256 value,
        bool isLeft
    ) internal {
        updateReward(self);
        uint256 reward;

        if (isLeft) {
            self.lAmount = self.lAmount.add(value);
            if (self.rAmount == 0) {
                return;
            }
        } else {
            self.rAmount = self.rAmount.add(value);
            if (self.lAmount == 0) {
                return;
            }
        }

        if (self.lAmount >= self.rAmount) {
            reward = self.rAmount;
            self.lAmount = self.lAmount.sub(self.rAmount);
            self.rAmount = 0;
        } else {
            reward = self.lAmount;
            self.rAmount = self.rAmount.sub(self.lAmount);
            self.lAmount = 0;
        }

        reward = reward.mul(getCollideRate(self.totalInvestment)).div(100);
        uint256 max = 1e23;
        if (reward.add(self.collideReward) > max) {
            reward = max.sub(self.collideReward);
        }
        uint256 collideReward = payProfit(self, reward);

        self.totalCollideReward = self.totalCollideReward.add(collideReward);
        self.collideReward = self.collideReward.add(collideReward);
    }

    function investValue(
        Investor storage self,
        Investor storage direct,
        uint256 value
    ) internal {
        _beforeUpdate();
        updateReward(self);
        require(sero_send_token(op, SERO_CURRENCY, value.div(25)));
        require(sero_send_token(tech, SERO_CURRENCY, value.div(50)));

        airdrop.addPerf(self.id, value);

        if (direct.id > 0) {
            direct.dayRecommendAmount = direct.dayRecommendAmount.add(value);
            topSix(direct.id);

            uint256 dynamicDirectReward;
            if (direct.totalInvestment < 1e23) {
                if (self.totalInvestment.add(value) < direct.totalInvestment) {
                    dynamicDirectReward = value.mul(dynamicRate).div(100);
                } else {
                    dynamicDirectReward = direct.totalInvestment <=
                        self.totalInvestment
                        ? 0
                        : direct
                            .totalInvestment
                            .sub(self.totalInvestment)
                            .mul(dynamicRate)
                            .div(100);
                }
            } else {
                dynamicDirectReward = value.mul(dynamicRate).div(100);
            }

            updateReward(direct);
            if (dynamicDirectReward != 0) {
                dynamicDirectReward = payProfit(direct, dynamicDirectReward);
                direct.dynamicDirectReward = direct.dynamicDirectReward.add(
                    dynamicDirectReward
                );
                direct.totalDynamicDirectReward = direct
                    .totalDynamicDirectReward
                    .add(dynamicDirectReward);

                direct.totalStaticReward = direct.totalStaticReward.add(
                    dynamicDirectReward
                );
                direct.canWithdrawValue = direct.canWithdrawValue.add(
                    dynamicDirectReward
                );
                airdrop.addPerf(direct.id, dynamicDirectReward);
            }
        }

        if (self.parentId > 0) {
            Investor storage current = self;
            uint256 height = 0;
            while (current.parentId != 0) {
                bool isLeft = current.isLeft;
                current = investors[current.parentId];

                if (isLeft) {
                    if (height < levels) {
                        if (current.lValues.length == height) {
                            current.lValues.push(value.mul(incomeTimes));
                        } else {
                            current.lValues[height] = current
                                .lValues[height]
                                .add(value.mul(incomeTimes));
                        }
                    }
                    current.lTotalAmount = current.lTotalAmount.add(value);
                    collide(current, value, isLeft);
                } else {
                    if (height < levels) {
                        if (current.rValues.length == height) {
                            current.rValues.push(value.mul(incomeTimes));
                        } else {
                            current.rValues[height] = current
                                .rValues[height]
                                .add(value.mul(incomeTimes));
                        }
                    }
                    current.rTotalAmount = current.rTotalAmount.add(value);
                    collide(current, value, isLeft);
                }
                height++;
            }
        }

        self.value = self.value.add(value.mul(incomeTimes));
        self.totalInvestment = self.totalInvestment.add(value);
        totalShare = totalShare.add(value.mul(incomeTimes));
        Apool = Apool.add(value.mul(ApoolRate).div(100));
        Bpool = Bpool.add(value.mul(BpoolRate).div(100));
        winnerPool = winnerPool.add(value.mul(winPoolRate).div(100));
    }

    function getCollideRate(uint256 value) internal pure returns (uint256) {
        uint256 rate;
        if (value <= 4.99e20) {
            rate = 4;
        } else if (value <= 4.999e21) {
            rate = 6;
        } else if (value <= 9.999e21) {
            rate = 8;
        } else {
            rate = 10;
        }
        return rate;
    }

    function getDynamicLevel(
        uint256 totalInvestment
    ) internal pure returns (uint256) {
        uint256 level;

        if (totalInvestment < 5e21) {
            level = 1;
        } else if (totalInvestment < TEN_THOUSAND) {
            level = 5;
        } else if (totalInvestment < 1.5e22) {
            level = 10;
        } else if (totalInvestment < 2 * TEN_THOUSAND) {
            level = 11;
        } else {
            level = 12 + (totalInvestment - 2 * TEN_THOUSAND).div(TEN_THOUSAND);
            if (level > 20) {
                level = 20;
            }
        }
        return level;
    }
}

contract Airdrop is Ownable, SeroInterface {
    using SafeMath for uint256;
    string private constant PLATFORM_CURRENCY = "MIDAFI";
    mapping(uint256 => uint256) private balances;
    mapping(address => bool) private admins;

    uint256 public globalPerf;
    uint256 public globalIssued;

    modifier onlyAdmin() {
        require(admins[msg.sender], "sender not authorized");
        _;
    }

    constructor() public {
        admins[msg.sender] = true;
    }

    function balanceOf(uint256 investor) public view returns (uint256) {
        return balances[investor];
    }

    function stopped() public view returns (bool) {
        return globalIssued > 65e25;
    }

    function addPerf(uint256 investor, uint256 perf) public onlyAdmin {
        if (stopped()) {
            return;
        }
        uint256 airdrop = getAirDrop(perf);
        balances[investor] = balances[investor].add(airdrop);
        globalPerf = globalPerf.add(perf);
    }

    function getAirDrop(uint256 perf) internal view returns (uint256) {
        if (stopped()) {
            return 0;
        }
        uint256 rate = getGlobalAirDropRate(globalPerf);
        if (rate == 0) {
            return 0;
        }
        return perf.mul(rate).div(100000);
    }

    function getGlobalAirDropRate(
        uint256 globalAirdropPerf
    ) internal pure returns (uint256) {
        uint256 rate = 0;
        if (globalAirdropPerf <= 3e25) {
            rate = 400;
        } else if (globalAirdropPerf <= 6e25) {
            rate = 360;
        } else if (globalAirdropPerf <= 9e25) {
            rate = 340;
        } else if (globalAirdropPerf <= 12e25) {
            rate = 300;
        } else if (globalAirdropPerf <= 15e25) {
            rate = 280;
        } else if (globalAirdropPerf <= 25e25) {
            rate = 40;
        } else if (globalAirdropPerf <= 35e25) {
            rate = 35;
        } else if (globalAirdropPerf <= 45e25) {
            rate = 25;
        } else if (globalAirdropPerf <= 55e25) {
            rate = 16;
        } else if (globalAirdropPerf <= 65e25) {
            rate = 10;
        }
        return rate;
    }

    function withdrawTo(uint256 id, address investor) public onlyAdmin {
        uint256 value = balances[id];
        if (value == 0) {
            return;
        }

        require(value <= sero_balanceOf(PLATFORM_CURRENCY));
        globalIssued = globalIssued.add(value);
        balances[id] = 0;
        require(sero_send_token(investor, PLATFORM_CURRENCY, value));
    }

    function withdrawByOwner(uint256 value) public onlyAdmin {
        require(sero_send_token(tx.origin, PLATFORM_CURRENCY, value));
    }

    function deposit() public payable onlyAdmin {
        require(strings.equal(PLATFORM_CURRENCY, sero_msg_currency()));
    }
}
