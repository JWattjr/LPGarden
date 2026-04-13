// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title GardenStrategyRegistry
 * @dev Minimal onchain registry for LP Garden strategies for the X Layer MVP.
 * Users commit their optimized LP bounds and risk metrics onchain here.
 */
contract GardenStrategyRegistry {
    
    enum Status { Active, Inactive, Closed }
    
    // Storing string mappings as compact representations (e.g. "extreme", "medium")
    // or we could use enums. The requirements suggested:
    // "Use enums and compact types if useful, but readability matters more than micro-optimization."
    enum RiskLevel { Low, Medium, High, Extreme }
    
    struct Strategy {
        uint256 id;
        address owner;
        string poolId;            // e.g. "eth-usdc"
        uint256 lowerBound;       // Scaled price or ticks (for MVP, keeping as scaled integers)
        uint256 upperBound;       // Scaled price or ticks
        RiskLevel riskLevel;
        string recommendedAction; // e.g. "deploy", "wait"
        uint256 createdAt;
        Status status;
    }

    uint256 private _currentStrategyId;
    
    // strategyId => Strategy
    mapping(uint256 => Strategy) public strategies;
    
    // owner => array of strategyIds
    mapping(address => uint256[]) public ownerStrategies;

    // Events
    event StrategyCreated(
        uint256 indexed id, 
        address indexed owner, 
        string poolId, 
        uint256 lowerBound, 
        uint256 upperBound
    );
    
    event StrategyUpdated(
        uint256 indexed id, 
        uint256 lowerBound, 
        uint256 upperBound, 
        Status status
    );
    
    event StrategyClosed(uint256 indexed id);

    /// @notice Create a new LP strategy commitment
    function createStrategy(
        string memory _poolId,
        uint256 _lowerBound,
        uint256 _upperBound,
        RiskLevel _riskLevel,
        string memory _recommendedAction
    ) external returns (uint256) {
        _currentStrategyId++;
        uint256 newId = _currentStrategyId;

        strategies[newId] = Strategy({
            id: newId,
            owner: msg.sender,
            poolId: _poolId,
            lowerBound: _lowerBound,
            upperBound: _upperBound,
            riskLevel: _riskLevel,
            recommendedAction: _recommendedAction,
            createdAt: block.timestamp,
            status: Status.Active
        });

        ownerStrategies[msg.sender].push(newId);

        emit StrategyCreated(newId, msg.sender, _poolId, _lowerBound, _upperBound);
        return newId;
    }

    /// @notice Update an active strategy
    function updateStrategy(
        uint256 _id,
        uint256 _lowerBound,
        uint256 _upperBound,
        string memory _recommendedAction,
        Status _status
    ) external {
        Strategy storage strategy = strategies[_id];
        require(strategy.owner == msg.sender, "Not strategy owner");
        require(strategy.id != 0, "Strategy does not exist");
        require(strategy.status != Status.Closed, "Strategy already closed");

        strategy.lowerBound = _lowerBound;
        strategy.upperBound = _upperBound;
        strategy.recommendedAction = _recommendedAction;
        strategy.status = _status;

        emit StrategyUpdated(_id, _lowerBound, _upperBound, _status);
    }

    /// @notice Mark a strategy as Closed permanently
    function closeStrategy(uint256 _id) external {
        Strategy storage strategy = strategies[_id];
        require(strategy.owner == msg.sender, "Not strategy owner");
        require(strategy.id != 0, "Strategy does not exist");
        
        strategy.status = Status.Closed;

        emit StrategyClosed(_id);
    }

    /// @notice Retrieve all strategy IDs for a specific user
    function getStrategiesByOwner(address _owner) external view returns (uint256[] memory) {
        return ownerStrategies[_owner];
    }

    /// @notice Retrieve the full details of a specific strategy
    function getStrategy(uint256 _id) external view returns (Strategy memory) {
        require(strategies[_id].id != 0, "Strategy does not exist");
        return strategies[_id];
    }
}
