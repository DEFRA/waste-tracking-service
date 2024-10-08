# frozen_string_literal: true

# Title data specification
module UserData
  @users = {
    LOCAL: {
      USER1: {
        businessName: 'WTS Testing',
        businessUnitId: '',
        userId: '655383298578'
      },
      USER2: {
        businessName: 'Wts Testing',
        username: 'Wtst testing Team member',
        businessUnitId: '',
        userId: '772918061129'
      },
      USER3: {
        businessName: 'Wts Testing',
        username: 'Wtst testing Team member',
        businessUnitId: '',
        userId: '772918061129'
      },
      USER4: {
        businessName: 'Wts Testing',
        username: 'Wtst testing Team member',
        businessUnitId: '',
        userId: '772918061129'
      },
      EMAIL_USER1: {
        businessName: '',
        businessUnitId: '',
        userId: '',
        password: ''
      }
    },
    DEV: {
      USER1: {
        businessName: 'WTS USER DEV 1',
        businessUnitId: '',
        userId: '465230171890'
      },
      USER2: {
        businessName: 'Wts USER DEV 2',
        businessUnitId: '',
        userId: '135263446271'
      },
      USER3: {
        businessName: 'WTS USER DEV 3',
        businessUnitId: '',
        userId: '439168877251'
      },
      USER4: {
        businessName: 'WTS USER DEV 4',
        businessUnitId: '',
        userId: '213944161257'
      },
      USER5: {
        businessName: 'WTS USER DEV 5',
        businessUnitId: '',
        userId: '547223973558'
      },
      USER6: {
        businessName: 'WTS USER DEV 6',
        businessUnitId: '',
        userId: '344330805112'
      },
      USER7: {
        businessName: 'WTS USER DEV 7',
        businessUnitId: '',
        userId: '836363665373'
      },
      USER8: {
        businessName: 'WTS USER DEV 8',
        businessUnitId: '',
        userId: '910505857560'
      },
      EMAIL_USER1: {
        businessName: '',
        businessUnitId: '',
        userId: '',
        password: ''
      }
    },
    TST: {
      USER1: {
        businessName: 'WTS USER DEV 1',
        businessUnitId: '',
        userId: '135263446271'
      },
      USER2: {
        businessName: 'Wts USER DEV 2',
        businessUnitId: '',
        userId: '154374835034'
      },
      USER3: {
        businessName: 'WTS USER DEV 3',
        businessUnitId: '',
        userId: '439168877251'
      },
      USER4: {
        businessName: 'WTS USER DEV 4',
        businessUnitId: '',
        userId: '213944161257'
      },
      USER5: {
        businessName: 'WTS USER DEV 5',
        businessUnitId: '',
        userId: '547223973558'
      },
      USER6: {
        businessName: 'WTS USER DEV 6',
        businessUnitId: '',
        userId: '344330805112'
      },
      USER7: {
        businessName: 'WTS USER DEV 7',
        businessUnitId: '',
        userId: '836363665373'
      },
      USER8: {
        businessName: 'WTS USER DEV 8',
        businessUnitId: '',
        userId: '910505857560'
      },
      EMAIL_USER1: {
        businessName: '',
        businessUnitId: '',
        userId: '',
        password: ''
      }
    },
    PRE: {
      USER1: {
        businessName: 'WTS Testing',
        businessUnitId: '',
        userId: '521578352286'
      },
      USER2: {
        businessName: 'Wts Testing',
        businessUnitId: '',
        userId: '655383298578'
      },
      USER3: {
        businessName: 'Wts Testing',
        businessUnitId: '',
        userId: '233627527051'
      },
      USER4: {
        businessName: 'Wts Testing',
        businessUnitId: '',
        userId: '560132886535'
      },
      USER5: {
        businessName: 'Wts Testing',
        businessUnitId: '',
        userId: '541873557611'
      },
      USER6: {
        businessName: 'WTS Testing',
        businessUnitId: '',
        userId: '950393233513'
      },
      USER7: {
        businessName: 'WTS Testing',
        businessUnitId: '',
        userId: '584732804173'
      },
      USER8: {
        businessName: 'WTS Testing',
        businessUnitId: '',
        userId: '847606471615'
      },
      USER9: {
        businessName: 'WTS Testing',
        businessUnitId: '',
        userId: '967837632734'
      },
      USER10: {
        businessName: 'WTS Testing',
        businessUnitId: '',
        userId: '682273410566'
      },
      EMAIL_USER1: {
        businessName: 'aabey0@hotmail.com',
        businessUnitId: '',
        userId: '148287751353'
      }
    }
  }

  @email_lists = {
    LOCAL: {
      EMAIL_USER1: '{ "groupEmail":"group@defra.gov.uk",
             "businessUnitEmail":"user@business.com",
             "personalEmail":"user@persoanl.com" }'
    },
    DEV: {
      EMAIL_USER1: '{ "groupEmail":"group2@defra.gov.uk",
         "businessUnitEmail":"corres@business.com",
         "personalEmail":"cmuser1@persoanl.com"}'
    }
  }

  def self.email_address_list(user)
    @email_lists.fetch(Env.test_env.to_sym).fetch(user)
  end

  def self.users
    @users.fetch(Env.test_env.to_sym)
  end
end
