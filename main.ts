import './style.css';

// Add import statements here

import usernameComponent from './components/text.js';
import passwordComponent from './components/password.js';
import submitButtonComponent from './components/submit-button.js';
import protect from './components/protect.js';
import flowLinkComponent from './components/flow-link.js';

// Tutorial: Add configuration object here

(async () => {
  const formEl = document.getElementById('form') as HTMLFormElement;

  // Tutorial: Add the DaVinci Client initialization function

  // Tutorial: Add the JavaScript SDK config method here

  // Tutorial: Add the store subscription here

  function renderComplete() {
    // Tutorial: Add the get methods for client and server info here

    let code = '';
    let session = '';
    let state = '';

    // Tutorial: Add the conditionals here for retrieving the code, session, and state

    let tokens;

    formEl.innerHTML = `
      <h2>Complete</h2>
      <pre>Session: ${session}</pre>
      <pre>Authorization: ${code}</pre>
      <pre>Access Token:</pre>
      <pre
        id="accessToken"
        style="display: block; max-width: 400px; text-wrap: wrap; overflow-wrap: anywhere;"
      >
        --
      </pre>
      <button type="button" id="tokensButton">Get Tokens</button><br />
      <button type="button" id="logoutButton">Logout</button>
    `;

    const tokenBtn = document.getElementById('tokensButton') as HTMLButtonElement;
    tokenBtn.addEventListener('click', async () => {
      // Tutorial: Add the get method here for retrieving the tokens

      console.log(tokens);

      const tokenPreEl = document.getElementById('accessToken') as HTMLPreElement;
      tokenPreEl.innerText = tokens?.accessToken || '';
    });

    const loginBtn = document.getElementById('logoutButton') as HTMLButtonElement;
    loginBtn.addEventListener('click', async () => {
      // Tutorial: Add the logout method here

      window.location.reload();
    });
  }

  function renderError() {
    // Tutorial: Add the get method here for retrieving the error

    formEl.innerHTML = `
      <h2>Error</h2>
      <pre>${error?.message}</pre>
    `;
  }

  async function renderForm() {
    formEl.innerHTML = '';
    let formName = '';

    // Tutorial: Add the get methods for client here

    // Tutorial: Add formName assignment here

    const header = document.createElement('h2');
    header.innerText = formName || '';
    formEl.appendChild(header);

    const collectors: any = [];
    collectors.forEach((collector) => {
      if (collector.type === 'TextCollector' && collector.name === 'protectsdk') {
        protect(
          formEl,
          collector,
          // Tutorial: Add updater method here
        );
      } else if (collector.type === 'TextCollector') {
        usernameComponent(
          formEl,
          collector,
          // Tutorial: Add updater method here
        );
      } else if (collector.type === 'PasswordCollector') {
        passwordComponent(
          formEl,
          collector,
          // Tutorial: Add updater method here
        );
      } else if (collector.type === 'SubmitCollector') {
        submitButtonComponent(
          formEl,
          collector,
        );
      } else if (collector.type === 'FlowCollector') {
        flowLinkComponent(
          formEl,
          collector,
          // Tutorial: Add flow method here
          renderForm,
        );
      }
    });
  }

  function mapRenderer(node) {
    // Tutorial: Add conditionals here for the node status
  }

  formEl.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Tutorial: Add DaVinci next method here

    // Tutorial: Call `mapRenderer` method here
  });

  // Tutorial: Add DaVinci Client start method here

  // Tutorial: Call `mapRenderer` method here
})();
