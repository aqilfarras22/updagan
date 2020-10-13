<template>
  <div class="signature">
    <div id="signature-pad" class="signature-pad">
      <div class="signature-pad--body">
        <canvas></canvas>
      </div>
      <div class="signature-pad--footer">
        <div class="signature-pad--actions">
          <div>
            <b-button size="sm" variant="link" class="p-0" @click="clearSignature()">Clear</b-button>
            <!--  the commented code is for future purpose, in case if we need more formats. -->
            <!-- <button type="button" class="button clear" data-action="clear" @click="clearSignature()">Clear</button>
            <button type="button" class="button" data-action="change-color">Change color</button>
            <button type="button" class="button" data-action="undo">Undo</button> -->
          </div>
          <!--  the commented code is for future purpose, in case if we need more formats. -->
          <!-- <div>
            <button type="button" class="button save" data-action="save-png" @click="saveSignature('png')">Save as PNG</button>
            <button type="button" class="button save" data-action="save-jpg" @click="saveSignature('jpg')">Save as JPG</button>
            <button type="button" class="button save" data-action="save-svg" @click="saveSignature('svg')">Save as SVG</button>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SignaturePad from 'signature_pad';
import { mapActions, mapGetters } from 'vuex';
import signatureStatuses from '@/constants/signatureStatuses';

export default {
  name: 'signature',
  data() {
    return {
      signaturePad: null,
      canvas: null,
      signatureStatuses,
    };
  },
  computed: {
    ...mapGetters(['getSignatureStatus']),
  },
  watch: {
    getSignatureStatus: {
      handler(val) {
        if (val === this.signatureStatuses.SIGNATURE_INIT
          || val === this.signatureStatuses.SIGNATURE_RESET) {
          window.setTimeout(() => {
            this.resizeCanvas();
          }, 100);
        }
      },
    },
  },
  methods: {
    ...mapActions(['setSignatureAction', 'setSignatureStatusAction']),
    initSignaturePad() {
      const wrapper = document.getElementById('signature-pad');
      this.canvas = wrapper.querySelector('canvas');
      this.signaturePad = new SignaturePad(this.canvas, {
        // It's Necessary to use an opaque color when saving image as JPEG;
        // this option can be omitted if only saving as PNG or SVG
        backgroundColor: 'rgb(255, 255, 255)',
        onEnd: () => {
          this.saveSignature('png');
        },
      });
    },
    resizeCanvas() {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      this.canvas.width = this.canvas.offsetWidth * ratio;
      this.canvas.height = this.canvas.offsetHeight * ratio;
      this.canvas.getContext('2d').scale(ratio, ratio);
      const inProgressStatus = this.signatureStatuses.SIGNATURE_IN_PROGRESS;
      this.setSignatureStatusAction(inProgressStatus);
      // This will clear the canvas, which might be needed.
      // But for now, we are not clearning the canvas
      // this.signaturePad.clear();
    },
    downloadFile(dataURL, filename) {
      const blob = this.dataURLToBlob(dataURL);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style = 'display: none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    },
    dataURLToBlob(dataURL) {
      let byteString = null;
      if (dataURL.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(dataURL.split(',')[1]);
      } else {
        byteString = unescape(dataURL.split(',')[1]);
      }

      // separate out the mime component
      const mimeString = dataURL
        .split(',')[0]
        .split(':')[1]
        .split(';')[0];

      // write the bytes of the string to a typed array
      const ia = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ia], { type: mimeString });
    },
    clearSignature() {
      this.signaturePad.clear();
      this.setSignatureAction(null);
    },
    saveSignature(type) {
      let formatType = null;
      //  the switch is for future purpose, in case if we need more formats.
      switch (type) {
        case 'png':
          formatType = '';
          break;
        case 'jpg':
          formatType = 'image/jpeg';
          break;
        case 'svg':
          formatType = 'image/svg+xml';
          break;
        default:
          window.console.log('Type not matched');
          break;
      }
      const dataURL = this.signaturePad.toDataURL(formatType);
      //  to download the signature file directly
      // this.downloadFile(dataURL, `signature.${type}`);
      const blob = this.dataURLToBlob(dataURL);
      this.setSignatureAction(blob);
    },
  },
  mounted() {
    this.initSignaturePad();
  },
};
</script>

<style scoped lang="scss">
.signature-pad {
  position: relative;
  display: flex;
  flex-direction: column;
  font-size: 10px;
  width: 100%;
  height: 100%;
  min-height: 120px;
  max-width: 800px;
  max-height: 400px;
  background-color: #fff;
  border-radius: 4px;
}

.signature-pad::before,
.signature-pad::after {
  position: absolute;
  z-index: -1;
  content: '';
  width: 40%;
  height: 10px;
  bottom: 10px;
  background: transparent;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.4);
}

.signature-pad::before {
  left: 20px;
  -webkit-transform: skew(-3deg) rotate(-3deg);
  transform: skew(-3deg) rotate(-3deg);
}

.signature-pad::after {
  right: 20px;
  -webkit-transform: skew(3deg) rotate(3deg);
  transform: skew(3deg) rotate(3deg);
}

.signature-pad--body {
  position: relative;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  border-radius: 4px;
  border: 1px solid #ced4da;
}

.signature-pad--body canvas {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.02) inset;
}

.signature-pad--footer {
  color: #c3c3c3;
  text-align: center;
  font-size: 1.2em;
  z-index: 99;
}

.signature-pad--actions {
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
}

#github img {
  border: 0;
}

@media (max-width: 940px) {
  #github img {
    width: 90px;
    height: 90px;
  }
}
</style>

