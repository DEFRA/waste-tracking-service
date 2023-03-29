@allowed([
  'APS', 'CAT', 'DEV', 'LOG', 'MST', 'OPS', 'PRD', 'PRE', 'SEC', 'SND', 'TST'
])
@description('''
  The environment that we are deploying into, according to the naming and
  standard, for example _SND_, _DEV_, _TST_ or _PRD_.
''')
param environment string = 'SND'

@minLength(3)
@maxLength(3)
@description('''
  Code that uniquely identifies the service, application or product that is
  assigned by the CSC WebOps team. The Waste Tracking Service is allocated
  _WTS_.
''')
param serviceCode string = 'WTS'

@minValue(1)
@maxValue(9)
@description('''
  The CSC resource naming convention defines an _environment number_ that is
  built into all resource names. This is to provide separate namespaces for
  example to distinct deployments of a development environment.

  Most of the time this value will be _1_.
''')
param environmentNumber int = 1

@allowed([ 'northeurope', 'westeurope', 'uksouth', 'ukwest' ])
@description('Primary Azure region for all deployed resources.')
param primaryRegion string = 'uksouth'

@description('''
  CIDR prefixes for the created virtual network and its subnet. See the default
  parameters file for an example. Subnets are:
  - _data_ - Recommended _/26_ prefix.
  - _ado_ - Recommend _/26_ prefix.
''')
param addressSpace object = {
  virtualNetwork: null
  subnets: {
    data: null
    ado: null
  }
}

@description('''
  The CSC tagging policy requires all resources to be tagged with a created
  date. A default value is provided but a value will have to be supplied in
  order to have idempotent deployments.
''')
param createdDate string = utcNow('yyyyMMdd')

module tags '../util/tags.bicep' = {
  name: 'hub-tags'
  params: {
    environment: environment
    serviceCode: serviceCode
    createdDate: createdDate
    location: primaryRegion
  }
}

module network './network.bicep' = {
  name: 'hub-network'
  params: {
    env: environment
    svc: serviceCode
    envNum: environmentNumber
    primaryRegion: primaryRegion
    addressSpace: addressSpace
    defaultTags: union(tags.outputs.defaultTags, { Tier: 'NETWORK' })
  }
}

module dns './dns.bicep' = {
  name: 'hub-dns'
  params: {
    virtualNetworks: [ network.outputs.virtualNetwork ]
    defaultTags: union(tags.outputs.defaultTags, { Tier: 'NETWORK' })
  }
}

module management './management.bicep' = {
  name: 'hub-management'
  params: {
    env: environment
    svc: serviceCode
    envNum: environmentNumber
    primaryRegion: primaryRegion
    adoSubnet: network.outputs.subnets.ado
    defaultTags: union(tags.outputs.defaultTags, { Tier: 'OTHER' })
  }
}

module data './data.bicep' = {
  name: 'hub-data'
  params: {
    env: environment
    svc: serviceCode
    envNum: environmentNumber
    primaryRegion: primaryRegion
    subnet: network.outputs.subnets.data
    privateDnsZones: dns.outputs.privateZones
    defaultTags: union(tags.outputs.defaultTags, { Tier: 'DATA' })
  }
}

@description('Reference to created Virtual Network.')
output virtualNetwork object = union(
  network.outputs.virtualNetwork, { resourceGroupName: resourceGroup().name }
)

@description('References to created Private DNS Zones.')
output privateDnsZones object = dns.outputs.privateZones

@description('Resource Group for created Private DNS Zones.')
output privateDnsResourceGroupName string = resourceGroup().name

@description('Reference to created Azure Monitor Private Link Scope.')
output monitorPrivateLinkScope object = {
  name: data.outputs.monitorPrivateLinkScope.name
  resourceGroupName: resourceGroup().name
}
