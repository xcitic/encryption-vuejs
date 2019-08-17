<template>
  <div class="hello">

    <input type="text" class="text-to-encrypt">

    <button class="encrypt btn btn-primary">
          Encrypt message
    </button>
    <button class="decrypt btn btn-secondary">
      Decrypt message
    </button>
    <br><br>
    <textarea class="text-encrypted" rows="5">Encrypted Message will appear here</textarea>
    <textarea class="text-decrypted"  rows="5">Decrypted Message will appear here</textarea>

  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },

  data() {
    return {
      ciphertext: null
    }
  },

  mounted() {
    /*
      Generate an encryption key pair, then set up event listeners
      on the "Encrypt" and "Decrypt" buttons.
      */
      let started = new Date().getTime();
      let keylength = 8192;
      window.crypto.subtle.generateKey(
        {
        name: "RSA-OAEP",
        // Consider using a 4096-bit key for systems that require long-term security
        modulusLength: keylength,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-512",
        },
        true,
        ["encrypt", "decrypt"]
      ).then((keyPair) => {
        let finished = new Date().getTime();
        let usedTime = finished - started;
        console.log(`Making keypair with modulus ${keylength} took: ${usedTime} milliseconds`)
        const encryptButton = document.querySelector(".encrypt");
        encryptButton.addEventListener("click", () => {
          this.encryptMessage(keyPair.publicKey);
        });

        const decryptButton = document.querySelector(".decrypt");
        decryptButton.addEventListener("click", () => {
          this.decryptMessage(keyPair.privateKey);
        });
      });

   //

   //
   //


  },


  methods: {

    async encryptMessage(key) {
      let encoded = this.getMessageEncoding();
      this.ciphertext = await window.crypto.subtle.encrypt(
        {
          name: "RSA-OAEP"
        },
        key,
        encoded
      );

      let buffer = new Uint8Array(this.ciphertext, 0, 5);
      const cipherTextValue = document.querySelector('.text-encrypted')
      cipherTextValue.textContent = `${buffer}...[${this.ciphertext.byteLength} bytes total]`;
    },

    async decryptMessage(key) {
      let decrypted = await window.crypto.subtle.decrypt(
        {
          name: "RSA-OAEP"
        },
        key,
        this.ciphertext
      );
      let dec = new TextDecoder();
      const decryptedValue = document.querySelector('.text-decrypted');
      decryptedValue.textContent = dec.decode(decrypted)

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
