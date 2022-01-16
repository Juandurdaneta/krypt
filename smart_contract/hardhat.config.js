// https://eth-ropsten.alchemyapi.io/v2/ywSSwpVfYRRbQqKTlU0-z_vbWyHov719

require('@nomiclabs/hardhat-waffle')

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/ywSSwpVfYRRbQqKTlU0-z_vbWyHov719',
      accounts: ['001c582ff237be1555b3a3d7a5abb48faced1b9675c0027ed89f5e30a0e0283a']
    }
  }
}