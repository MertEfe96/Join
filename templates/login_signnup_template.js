function loginTemplate() {
  return `
  <div class="bgLogin">
      <img class="LogoNavImgLogin" src="./assets/img/Capa 1.svg" />
      <div class="loginField" id="loginField">
    <div class="loginBox">
          <div class="headlineAndBorder">
            <h1 class="loginHeadline">Log in</h1>
            <div class="border"></div>
          </div>
          <form class="loginForm" onsubmit="return false;">
            <div class="inputWrapper">
              <input
                id="emailLogin"
                class="inputLogin"
                type="text"
                name="email"
                autocomplete="email"
                placeholder="Email"
                required />
              <img
                src="./assets/icons/mail.svg"
                alt="email icon"
                class="iconLogin" />
            </div>
            <div class="inputWrapper">
              <input
                id="passwordLogin"
                class="inputLogin"
                type="password"
                name="password"
                autocomplete="password"
                placeholder="Password"
                required />
              <img
                src="./assets/icons/lock.svg"
                alt="lock icon"
                class="iconLogin" />
            </div>
            <div class="rememberDiv">
              <input class="hover" type="checkbox" name="" id="" />
              <p>Remember me</p>
            </div>
            <div class="loginButtonDiv">
              <button class="hover buttonLogin">Log in</button>
              <span onclick="closeLogin()" class="hover buttonGuestLogin">Guest Log in</span>
            </div>
          </form>
        </div>
        </div>
        <div class="singUpLogin">
        <span class="singUpLoginSpan">Not a Join user?</span>
        <button class="hover buttonSingUpLogin">Sign up</button>
      </div>
    </div>
    `;
}

function signUpButtonTemplate() {
  return `
  <div class="singUpLogin">
        <span class="singUpLoginSpan">Not a Join user?</span>
        <button class="hover buttonSingUpLogin">Sign up</button>
      </div>
  `;
}

function signUpTemplate() {
  return `
  <div class="bgLogin">
      <img class="LogoNavImgLogin" src="./assets/img/Capa 1.svg" />
      <div class="loginField" id="loginField">
  <div class="loginBox">
          <div class="headlineAndBorder">
            <h1 class="loginHeadline">Sign up</h1>
            <div class="border"></div>
          </div>
          <form class="loginForm" onsubmit="return false;">
            <div class="inputWrapper">
              <input
                id="nameSignUp"
                class="inputLogin"
                type="text"
                name="name"
                autocomplete="name"
                placeholder="Name"
                required />
              <img
                src="./assets/icons/person.svg"
                alt="email icon"
                class="iconLogin" />
            </div>
            <div class="inputWrapper">
              <input
                id="emailSignUp"
                class="inputLogin"
                type="text"
                name="email"
                autocomplete="email"
                placeholder="Email"
                required />
              <img
                src="./assets/icons/mail.svg"
                alt="email icon"
                class="iconLogin" />
            </div>
            <div class="inputWrapper">
              <input
                id="passwordSignUp"
                class="inputLogin"
                type="password"
                name="password"
                autocomplete="password"
                placeholder="Password"
                required />
              <img
                src="./assets/icons/lock.svg"
                alt="lock icon"
                class="iconLogin" />
            </div>
            <div class="inputWrapper">
              <input
                id="passwordConfirmSignUp"
                class="inputLogin"
                type="password"
                name="password"
                autocomplete="password"
                placeholder="Confirm Password"
                required />
              <img
                src="./assets/icons/lock.svg"
                alt="lock icon"
                class="iconLogin" />
            </div>
            <div class="rememberDiv center textGrey">
              <input class="hover" type="checkbox" name="" id="" />
              <p>
                I accept the
                <a class="noTextDeco" href="./privacy_policy.html"
                  >Privacy Policy</a
                >
              </p>
            </div>
            <div class="loginButtonDiv">
              <button class="hover buttonLogin">Sign up</button>
            </div>
          </form>
        </div>
        </div>
    </div>
  `;
}
