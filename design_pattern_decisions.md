# Design pattern decisions

- Inheritance and interfaces
> EthRadio inherits Initializable, PausableUpgradable, AccessControlUpgradable, UUPSUpgradable from @openzeppelin/contracts-upgradable.

- Access Control
> EthRadio inherits openzeppelin's `AccessControlUpgradable` contract and implements a role-based access control. Used roles are: `DEFAULT_ADMIN_ROLE`, `PAUSER_ROLE`, `UPGRADAER_ROLE`, `PUBLISHER_ROLE`, `SUBSCRIBER_ROLE`

- Upgradable contract
> EthRadio inherits openzeppelin's `UUPSUpgradable` contract and implements UUPS upgrade pattern. `3_upgrade_ethradio_contract.json.template` under `/migrations` can be used to upgrade to a new version of contract through UUPS method.