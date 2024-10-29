import './style.css';

import { Config, FRUser, TokenManager } from '@forgerock/javascript-sdk';
import davinci from '@forgerock/davinci-client';

import usernameComponent from './components/text.js';
import passwordComponent from './components/password.js';
import submitButtonComponent from './components/submit-button.js';
import protect from './components/protect.js';
import flowLinkComponent from './components/flow-link.js';

const config = {
  clientId: '724ec718-c41c-4d51-98b0-84a583f450f9',
  redirectUri: window.location.href,
  scope: 'openid profile email name revoke',
  serverConfig: {
    baseUrl: 'https://auth.pingone.ca/02fb4743-189a-4bc7-9d6c-a919edfe6447/',
    wellknown:
      'https://auth.pingone.ca/02fb4743-189a-4bc7-9d6c-a919edfe6447/as/.well-known/openid-configuration',
  },
};

(async () => {
  const formEl = document.getElementById('form') as HTMLFormElement;

  const davinciClient = await davinci({ config });
  await Config.setAsync(config);

  davinciClient.subscribe(() => {
    const node = davinciClient.getClient();
    console.log('Event emitted from store:', node);
  });

  function renderComplete() {
    const clientInfo = davinciClient.getClient();
    const serverInfo = davinciClient.getServer();

    let code = '';
    let session = '';
    let state = '';

    if (clientInfo?.status === 'success') {
      code = clientInfo.authorization?.code || '';
      state = clientInfo.authorization?.state || '';
    }

    if (serverInfo && serverInfo.status === 'success') {
      session = serverInfo.session || '';
    }

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
      tokens = await TokenManager.getTokens({ query: { code, state } });

      console.log(tokens);

      const tokenPreEl = document.getElementById('accessToken') as HTMLPreElement;
      tokenPreEl.innerText = tokens?.accessToken || '';
    });

    const loginBtn = document.getElementById('logoutButton') as HTMLButtonElement;
    loginBtn.addEventListener('click', async () => {
      await FRUser.logout({ logoutRedirectUri: window.location.href });

      window.location.reload();
    });
  }

  function renderError() {
    const error = davinciClient.getError();

    formEl.innerHTML = `
      <h2>Error</h2>
      <pre>${error?.message}</pre>
    `;
  }

  async function renderForm() {
    formEl.innerHTML = '';
    let formName = '';

    const clientInfo = davinciClient.getClient();

    if (clientInfo?.status === 'next') {
      formName = clientInfo.name || '';
    }

    const header = document.createElement('h2');
    header.innerText = formName || '';
    formEl.appendChild(header);

    const collectors: any = [];
    collectors.forEach((collector) => {
      if (collector.type === 'TextCollector' && collector.name === 'protectsdk') {
        protect(
          formEl,
          collector,
          davinciClient.update(collector),
        );
      } else if (collector.type === 'TextCollector') {
        usernameComponent(
          formEl,
          collector,
          davinciClient.update(collector),
        );
      } else if (collector.type === 'PasswordCollector') {
        passwordComponent(
          formEl,
          collector,
          davinciClient.update(collector),
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
          davinciClient.flow({ action: collector.output.key}),
          renderForm,
        );
      }
    });
  }

  function mapRenderer(nextNode) {
    if (nextNode.status === 'next') {
      renderForm();
    } else if (nextNode.status === 'success') {
      renderComplete();
    } else if (nextNode.status === 'error') {
      renderError();
    } else {
      console.error('Unknown node status', nextNode);
    }
  }

  const node = await davinciClient.start();

  formEl.addEventListener('submit', async (event) => {
    event.preventDefault();

    const newNode = await davinciClient.next();

    mapRenderer(newNode);
  });

  mapRenderer(node);
})();
