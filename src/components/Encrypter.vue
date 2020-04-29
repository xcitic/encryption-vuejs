<template>
  <div class="hello">

    <input type="text" class="text-to-encrypt">
    <div v-if="!isLocalKeySet">
        Setting local key
    </div>
    <div v-else>
        <button class="encrypt btn btn-primary" @click.prevent="encryptMessage">
          Encrypt message
        </button>
        <button class="decrypt btn btn-secondary" @click.prevent="decryptMessage">
          Decrypt message
        </button>
    </div>

    <br><br>
    <textarea class="text-encrypted" rows="5">Encrypted Message will appear here</textarea>
    <textarea class="text-decrypted"  rows="5">Decrypted Message will appear here</textarea>

  </div>
</template>

<script>
export default {
  name: 'Encrypter',
  props: {
    msg: String
  },

  data() {
    return {
      ciphertext: null,
      isLocalKeySet: false,
      localKeyPair: null,
      remoteKey: null,
      isRemoteKeySet: false
    }
  },

  mounted() {
    this.exchangeLocalKeyWithServer();
  },


  methods: {

    async exchangeLocalKeyWithServer() {
      await this.generateLocalKey();
      let localJWK = await this.exportLocalKey();
      this.sendKeyToServer(localJWK);
    },

    async exportLocalKey() {
      let exportedKey = await crypto.subtle.exportKey('jwk', this.localKeyPair.publicKey);
      return exportedKey
    },

    async sendKeyToServer(localJWK) {
      const response = await fetch('http://localhost:3000/exchangeKey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(localJWK)
      });
      let remoteJWK = await response.json();
      this.setRemoteKey(remoteJWK);
    },

    async generateLocalKey() {
      let started = new Date().getTime();
      let keylength = 8192;
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: keylength,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-512",
        },
        true,
        ["encrypt", "decrypt"]
      );
        this.localKeyPair = keyPair;
        this.isLocalKeySet = true;
        let finished = new Date().getTime();
        let usedTime = finished - started;
        console.log(`Making keypair with modulus ${keylength} took: ${usedTime} milliseconds`);
    },

    async setRemoteKey(remoteJWK) {
      // let remoteJWK = await this.getRemoteKey();
      let remoteKey = await this.importRemoteKey(remoteJWK);
      this.remoteKey = remoteKey;
      this.isRemoteKeySet = true;
    },

    async getRemoteKey() {
      let apiResponse = await fetch('http://localhost:3000/key');
      let rawKey = await apiResponse.json();
      return rawKey;
    },


    importRemoteKey(jwk) {
      return window.crypto.subtle.importKey(
        "jwk",
        jwk,
        {
          "name": "RSA-OAEP",
          "hash": "SHA-512"
        },
        true,
        ["encrypt", "wrapKey"]
      );
    },

    async encryptMessage() {
      let encoded = this.getMessageEncoding();
      this.ciphertext = await window.crypto.subtle.encrypt(
        {
          name: "RSA-OAEP"
        },
        this.localKeyPair.publicKey,
        encoded
      );

      let buffer = new Uint8Array(this.ciphertext, 0, 5);
      const cipherTextValue = document.querySelector('.text-encrypted');
      cipherTextValue.textContent = `${buffer}...[${this.ciphertext.byteLength} bytes total]`;
    },

    async decryptMessage() {
      let decrypted = await window.crypto.subtle.decrypt(
        {
          name: "RSA-OAEP"
        },
        this.localKeyPair.privateKey,
        this.ciphertext
      );
      let decoder = new TextDecoder();
      const decryptedValue = document.querySelector('.text-decrypted');
      decryptedValue.textContent = decoder.decode(decrypted)
    },

    getMessageEncoding() {
      const messageBox = document.querySelector(".text-to-encrypt");
      let message = messageBox.value;
      let encoder = new TextEncoder();
      return encoder.encode(message);
    },


  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
