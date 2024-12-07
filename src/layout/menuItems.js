
    
    const menus=[
        {
        label: "Bank Accounts",
        owner:[2,3,4],
            items: [
            // { label: 'Merchant Info', icon: 'pi pi-fw pi-briefcase', to: '/secure/merchantInfo' },
                { label: 'Bank Accounts', icon: 'pi pi-fw pi-wallet', to: '/secure/bankaccount' },
                { label: 'Fund Transfer', icon: 'pi pi-fw pi-send', to: '/secure/fundtransfer' },
                //{ label: 'Owner Details', icon: 'pi pi-fw pi-users', to: '/secure/ownerDetails' },

    
            ],
        },
        {
            label: "AlifPay Network",
            owner:[2,3],
                items: [
                
                    { label: 'Wallet Account', icon: 'pi pi-fw pi-mobile', to: '/secure/accounts' },
                    { label: 'My Sponsor', icon: 'pi pi-fw pi-users', to: '/secure/hierarchy' },
                    { label: 'Placement', icon: 'pi pi-fw pi-play', to: '/secure/binarary' },
                    { label: 'Hierarchy', icon: 'pi pi-fw pi-sliders-v', to: '/secure/referral' },
                    { label: 'My Reward', icon: 'pi pi-fw pi-gift', to: '/secure/reward' },
                    { label: 'My Redeem', icon: 'pi pi-fw pi-money-bill', to: '/secure/redeem' },
                ],
        },
        
        {
            label: "Pre-Registration Merchant  & Marketplace",
            owner:[2],
            items: [
                  
                  { label: 'e-Menu', icon: 'pi pi-fw pi-qrcode', to: '/secure/products', owner:[2] },
                   // { label: 'Products(Gallery)', icon: 'pi pi-fw pi-id-card', to: '/secure/products/dataview' },
                   { label: 'Merchant', icon: 'pi pi-fw pi-map', to: '/secure/stores', owner:[2]},
                   { label: 'Market-Place', icon: 'pi pi-fw pi-cart-plus', to: '/secure/marketplace', owner:[2]},
                   { label: 'Insurance', icon: 'pi pi-fw pi-heart-fill', to: '/secure/insurance', owner:[2]},
                   { label: 'Transactions', icon: 'pi pi-fw pi-arrow-right-arrow-left', to: '/secure/transactions', owner:[2]},
                   // { label: 'Stores(Gallery)', icon: 'pi pi-fw pi-id-card', to: '/secure/stores/dataview' }
            ],
        }, {
            label: "MPay Merchant ",
            owner:[2],
            items: [
                    { label: 'Enrollment documents ', icon: 'pi pi-fw pi-file', to: '/secure/mpayDocs', owner:[2] },
                    //{ label: 'usersTable', icon: 'pi pi-fw pi-id-card', to: '/secure/users' },
                    { label: 'Merchant Details', icon: 'pi pi-fw pi-truck', to: '/secure/merchantDetails', owner:[2] },
                    { label: 'Owner Details', icon: 'pi pi-fw pi-id-card', to: '/secure/ownerDetails', owner:[2] },
                    //{ label: 'Owner Details(Gallery)', icon: 'pi pi-fw pi-id-card', to: '/secure/ownerDetails/dataview' },
                    { label: 'Transaction Details', icon: 'pi pi-fw pi-chart-bar', to: '/secure/transactionDetails', owner:[2] },
                   
                    { label: 'Merchant Documents', icon: 'pi pi-fw pi-file', to: '/secure/merchantDocuments' , owner:[2]},
                    { label: 'Merchant Photos', icon: 'pi pi-fw pi-images', to: '/secure/merchantPhotos', owner:[2] },
                   
            ],
        }
    ];
    
    export default menus;
            