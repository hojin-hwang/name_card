class FirebaseLogin extends ComponentABS{
    constructor(user_data = null)
    {
        super();
        this.user_data = user_data;
        const firebaseConfig = {
        apiKey: "AIzaSyBZceFtJevRUYJk84f4Bg2vzgdPxPSVOUQ",
        authDomain: "devops-6a3a0.firebaseapp.com",
        projectId: "devops-6a3a0",
        storageBucket: "devops-6a3a0.appspot.com",
        messagingSenderId: "78125475743",
        appId: "1:78125475743:web:c36b3d39ebb36305703faa",
        measurementId: "G-G63X17YET8"
        };
        const firebaseApp = firebase.initializeApp(firebaseConfig);
        this.firebaseAuth = firebaseApp.auth();   
        this.firebaseAuth.languageCode = 'ko';
        this.ui = new firebaseui.auth.AuthUI(firebase.auth());
    }
    static get observedAttributes() {return ['attribute_name']; }

    handleClick(e) {
        e.composedPath().find((node) => 
        {
            if (!node.className || !node.className.match(/command/)) return false;
            
        });
    }
    onMessage(event){
        const window_url = `https://${window.location.hostname}`;
        //if(event.origin !== window_url) return;
        if(event.data?.msg) 
        {
            //로그인 되었다면 
            if(event.data.msg === `do_logout`) 
            {
                this._firebase_logout();
            }
            //로그인 상태를 묻는다
            if(event.data.msg === `is_login`) 
            {
                this._is_login_status();
            }
        }
        
    }

    connectedCallback() {
        if(!this.showComponent) return;
        this._render(this.user_data);
    }
        
    disconnectedCallback(){
        console.log("disconnectedCallback");
        window.removeEventListener("message", this.receiveMessage);
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        console.log('Custom square element attributes changed.');
        console.log(`${name}, ${oldValue}, ${newValue},`);
    }

    _render()
    {
        const template = document.createElement('template');
        try
        {
            template.innerHTML = `<div id="firebaseui-auth-container" style="display:none"></div>`;
        }
        catch(e)
        {
            console.log(e);
        }
        
        this.innerHTML = '';
        this.appendChild(template.content.cloneNode(true));
        this._show_login_form();
    }

    _show_login_form()
    {
        const uiConfig = {
            signInOptions: [
                {
                    provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
                    requireDisplayName: true,
                    
                },
                {
                    provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                }
            ],
            callbacks: {
                signInSuccessWithAuthResult: () => 
                    {
                        console.log("signInSuccessWithAuthResult!!");
                        this.post_message('status_login', null);
                    },
            }
        }
        this.ui.start("#firebaseui-auth-container", uiConfig);
    }

     _firebase_logout()
    {
        const _temp_post_message  = this.post_message;
        this.firebaseAuth.signOut().then(function() {   
                _temp_post_message("status_logout", null);
            }).catch(function(error) {
            if(error){
                    alert("로그아웃 실패");
                    console.log(error);
            }
        });
    }

    _is_login_status()
    {
        const _temp_post_message  = this.post_message;
        this.firebaseAuth.onAuthStateChanged((user) => {
        if (user) {
            _temp_post_message("status_login", null);
        }
        else
        {
            _temp_post_message("status_logout", null);
        }
        });
    }

}
customElements.define('firebase-login', FirebaseLogin);