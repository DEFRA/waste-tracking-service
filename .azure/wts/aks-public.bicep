@allowed([
  'APS', 'CAT', 'DEV', 'LOG', 'MST', 'OPS', 'PRD', 'PRE', 'SEC', 'SND', 'TST'
])
@description('CSC environment code.')
param env string = 'SND'

@minLength(3)
@maxLength(3)
@description('CSC service code.')
param svc string = 'WTS'

@minValue(1)
@maxValue(9)
@description('CSC environment number.')
param envNum int = 1

@allowed([ 'northeurope', 'westeurope', 'uksouth', 'ukwest' ])
@description('Primary Azure region for all deployed resources.')
param primaryRegion string = 'uksouth'

@description('Reference to existing subnet for Private Endpoints.')
param subnet object = {
  id: null
}

@description('Reference to existing AAD Group for cluster Admin access.')
param clusterAdminGroupObjectIds array = []

@description('Reference to existing user-assigned managed identites.')
param identities object = {
  aks: {
    id: null
  }
  kubelet: {
    id: null
  }
}

@description('AKS network configuration.')
param aksNetworkProfile object = {
  dnsServiceIP: null
  dockerBridgeCidr: null
  loadBalancerSku: null
  networkPlugin: null
  networkPolicy: null
  outboundType: null
  serviceCidr: null
}

@description('AKS nodepool VMSS resource allocation and metadata.')
param aksAgentPoolProfiles object = {
  system: {
    name: null
    count: null
    vmSize: null
    osDiskSizeGB: null
    osDiskType: null
    osType: null
    osSKU: null
    minCount: null
    maxCount: null
    enableAutoScaling: null
    type: null
    mode: 'System'
    scaleSetPriority: null
    maxPods: null
    availabilityZones: []
    maxSurge: null
    nodeTaints: []
  }
  user: {
    name: null
    count: null
    vmSize: null
    osDiskSizeGB: null
    osDiskType: null
    osType: null
    osSKU: null
    minCount: null
    maxCount: null
    enableAutoScaling: null
    type: null
    mode: 'User'
    scaleSetPriority: null
    maxPods: null
    availabilityZones: []
    maxSurge: null
    nodeTaints: []
  }
}

@description('User name for the Linux Virtual Machines')
param linuxAdminUsername string

@description('SSH Public Key value for the Linux Virtual Machines')
param sshRsaPublicKeyValue string

@description('Kubernetes version to be installed on AKS.')
param kubernetesVersion string = '1.24.9'

@description('''
IP ranges authorized to contact the Kubernetes API server. 
Passing an empty array will result in no IP restrictions. 
If any are provided, remember to also provide the public IP of the egress Azure Firewall 
otherwise your nodes will not be able to talk to the API server (e.g. Flux).''')
param clusterAuthorizedIpRanges array = []

@description('Tagging baseline applied to all resources.')
param defaultTags object = {}

var role = 'SPK'

var instance0 = {
  northeurope: 1, westeurope: 201, uksouth: 401, ukwest: 601
}[primaryRegion]

var aksName = join([ env, svc, role, 'KS', envNum, padLeft(instance0, 3, '0') ], '')

var sshRsaPublicKeyName = join(
  [ 
    aksName
    join([ env, svc, 'AKS', 'PK', envNum, padLeft(instance0, 3, '0') ], '')
  ], 
  '-'
)

// resource.properties.publicKey is not in the correct format to be linked in the cluster creation
// Generate the ssh key from cli and then store the public component in azure resource ?
resource sshRsaPublicKey 'Microsoft.Compute/sshPublicKeys@2022-11-01' = {
  name: sshRsaPublicKeyName
  location: primaryRegion

  properties: {
    publicKey: sshRsaPublicKeyValue
  }

  tags: union(defaultTags, { Name: sshRsaPublicKeyName })
}

var nodeResourceGroupName = join([ resourceGroup().name, aksName ], '-')

var logAnalyticsWorkspaceName = join(
  [ env, svc, 'HUB', 'LA', envNum, padLeft(instance0, 3, '0') ], ''
)

resource aks 'Microsoft.ContainerService/managedClusters@2022-11-02-preview' = {
  name: aksName
  location: primaryRegion
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${identities.aks.id}': {}
    }
  }
  properties: {
    aadProfile: {
      enableAzureRBAC: true
      managed: true
      adminGroupObjectIDs: clusterAdminGroupObjectIds
      tenantID: subscription().tenantId
    }
    addonProfiles: {
      omsagent: {
        config: {
          logAnalyticsWorkspaceResourceID: resourceId(resourceGroup().name, 'Microsoft.OperationalInsights/workspaces', logAnalyticsWorkspaceName)
        }
        enabled: true
      }
    }
    agentPoolProfiles: [
      {
        name: aksAgentPoolProfiles.system.name
        count: aksAgentPoolProfiles.system.count
        vmSize: aksAgentPoolProfiles.system.vmSize
        osDiskSizeGB: aksAgentPoolProfiles.system.osDiskSizeGB
        osDiskType: aksAgentPoolProfiles.system.osDiskType
        osType: aksAgentPoolProfiles.system.osType
        osSKU: aksAgentPoolProfiles.system.osSKU
        minCount: aksAgentPoolProfiles.system.minCount
        maxCount: aksAgentPoolProfiles.system.maxCount
        vnetSubnetID: subnet.id
        enableAutoScaling: aksAgentPoolProfiles.system.enableAutoScaling
        type: aksAgentPoolProfiles.system.type
        mode: aksAgentPoolProfiles.system.mode
        scaleSetPriority: aksAgentPoolProfiles.system.scaleSetPriority
        maxPods: aksAgentPoolProfiles.system.maxPods
        availabilityZones: aksAgentPoolProfiles.system.availabilityZones
        upgradeSettings: {
          maxSurge: aksAgentPoolProfiles.system.maxSurge
        }
        nodeTaints: aksAgentPoolProfiles.system.nodeTaints
      }
      {
        name: 'npuser01'
        count: 2
        vmSize: 'Standard_DS3_v2'
        osDiskSizeGB: 120
        osDiskType: 'Ephemeral'
        osType: 'Linux'
        osSKU: 'Ubuntu'
        minCount: 2
        maxCount: 5
        vnetSubnetID: subnet.id
        enableAutoScaling: true
        enableCustomCATrust: false
        enableFIPS: false
        enableEncryptionAtHost: false
        type: 'VirtualMachineScaleSets'
        mode: 'User'
        scaleSetPriority: 'Regular'
        scaleSetEvictionPolicy: 'Delete'
        orchestratorVersion: kubernetesVersion
        enableNodePublicIP: false
        maxPods: 30
        availabilityZones: [
          '1'
          '2'
          '3'
        ]
        upgradeSettings: {
          maxSurge: '33%'
        }
      }
    ]
    apiServerAccessProfile: {
      enablePrivateCluster: false
      authorizedIPRanges: clusterAuthorizedIpRanges
    }
    autoUpgradeProfile: {
      upgradeChannel: 'stable'
    }
    disableLocalAccounts: true
    dnsPrefix: aksName
    enableRBAC: true
    identityProfile: {
      kubeletidentity: {
        resourceId: identities.kubelet.id
      }
    }
    kubernetesVersion: kubernetesVersion
    linuxProfile: {
      adminUsername: linuxAdminUsername
      ssh: {
        publicKeys: [
          {
            keyData: sshRsaPublicKeyValue
          }
        ]
      }
    }
    networkProfile: {
      dnsServiceIP: aksNetworkProfile.dnsServiceIP
      dockerBridgeCidr: aksNetworkProfile.dockerBridgeCidr
      loadBalancerSku: aksNetworkProfile.loadBalancerSku
      networkPlugin: aksNetworkProfile.networkPlugin
      networkPolicy: aksNetworkProfile.networkPolicy
      outboundType: aksNetworkProfile.outboundType
      serviceCidr: aksNetworkProfile.serviceCidr
    }
    nodeResourceGroup: nodeResourceGroupName
    oidcIssuerProfile: {
      enabled: true
    }
    securityProfile: {
      workloadIdentity: {
        enabled: true
      }
    }
  }

  tags: union(defaultTags, { Name: aksName })
}

