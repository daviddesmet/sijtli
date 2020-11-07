<template>
  <div class="text-white">
    <h1 class="text-5xl">Cuentos de Terror</h1>
    <div class="my-4 mt-10">
      <p class="text-2xl mb-2">{{ sampleEnglish }}</p>
      <button
        class="border border-white text-white rounded p-4 hover:bg-gray-900 hover:border-pink-500 transition ease-in-out duration-700 mr-2"
        @click.prevent="play(this.sampleEnglish, 'en-US', 'JessaRUS')"
      >
        Reproducir en-US
      </button>
      <button
        class="border border-white text-white rounded p-4 hover:bg-gray-900 hover:border-pink-500 transition ease-in-out duration-700"
        @click.prevent="play(this.sampleEnglish, 'en-US', 'AriaNeural')"
      >
        Reproducir Neural en-US
      </button>
    </div>
    <div class="my-4 mt-10">
      <p class="text-2xl mb-2">{{ sampleSpanish }}</p>
      <button
        class="border border-white text-white rounded p-4 hover:bg-gray-900 hover:border-pink-500 transition ease-in-out duration-700 mr-2"
        @click.prevent="play(this.sampleSpanish, 'es-MX', 'HildaRUS')"
      >
        Reproducir es-MX
      </button>
      <button
        class="border border-white text-white rounded p-4 hover:bg-gray-900 hover:border-pink-500 transition ease-in-out duration-700"
        @click.prevent="play(this.sampleSpanish, 'es-MX', 'DaliaNeural')"
      >
        Reproducir Neural es-MX
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { SPEECH_SDK_KEY, SPEECH_SDK_REGION } from "@/constants/config";

@Options({})
export default class Stories extends Vue {
  speechConfig!: sdk.SpeechConfig;
  synthesizer!: sdk.SpeechSynthesizer;

  sampleEnglish = "When you're on the motorway, it's a good idea to use a sat-nav.";
  sampleSpanish = "Pórtate bien o el coco te comerá.";

  textToPitch(text: string, lang: string, voice: string): string {
    return `<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="${lang}">
              <voice name="${lang}-${voice}">
                ${text}
              </voice>
            </speak>`;
  }

  textToNeuralPitch(text: string, lang: string, voice: string): string {
    return `<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="${lang}">
              <voice name="${lang}-${voice}">
                <mstts:express-as style="cheerful">
                  ${text}
                </mstts:express-as>
            </speak>`;
  }

  play(text: string, lang = "en-US", voice = "JessaRUS"): void {
    this.synthesizer.speakSsmlAsync(
      this.textToPitch(text, lang, voice),
      (result) => {
        if (result) {
          // console.log(JSON.stringify(result));
        }
        // this.synthesizer.close();
      },
      (error) => {
        console.error(error);
        // this.synthesizer.close();
      }
    );
  }

  playNeural(text: string, lang = "en-US", voice = "AriaNeural"): void {
    this.synthesizer.speakSsmlAsync(
      this.textToNeuralPitch(text, lang, voice),
      (result) => {
        if (result) {
          // console.log(JSON.stringify(result));
        }
        // this.synthesizer.close();
      },
      (error) => {
        console.error(error);
        // this.synthesizer.close();
      }
    );
  }

  mounted(): void {
    this.speechConfig = sdk.SpeechConfig.fromSubscription(SPEECH_SDK_KEY, SPEECH_SDK_REGION);
    // this.speechConfig.speechRecognitionLanguage = "es-MX";

    // const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
    // const synthesizer = new sdk.SpeechSynthesizer(this.speechConfig, audioConfig);
    //synthesizer.speakTextAsync(

    // https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/language-support#standard-voices
    // "en-US", "JessaRUS"
    // "es-MX", "HildaRUS"

    this.synthesizer = new sdk.SpeechSynthesizer(this.speechConfig, undefined);
    // this.synthesizer.speakSsmlAsync(
    //   this.textToPitch(this.text, "es-MX", "HildaRUS"),
    //   (result) => {
    //     if (result) {
    //       // console.log(JSON.stringify(result));
    //     }
    //     this.synthesizer.close();
    //   },
    //   (error) => {
    //     console.error(error);
    //     this.synthesizer.close();
    //   }
    // );
  }
}
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Creepster&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Henny+Penny&display=swap");

h1 {
  font-family: "Creepster", cursive;
}

p {
  font-family: "Henny Penny", cursive;
}
</style>
