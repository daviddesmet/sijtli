<template>
  <div>
    <div class="my-4">
      <p>{{ sampleEnglish }}</p>
      <button
        class="border border-white text-white rounded p-4 hover:bg-gray-900 hover:border-pink-500 transition ease-in-out duration-700"
        @click.prevent="play(this.sampleEnglish, 'en-US', 'JessaRUS')"
      >
        Reproducir en-US
      </button>
    </div>
    <div class="my-4">
      <p>{{ sampleSpanish }}</p>
      <button
        class="border border-white text-white rounded p-4 hover:bg-gray-900 hover:border-pink-500 transition ease-in-out duration-700"
        @click.prevent="play(this.sampleSpanish, 'es-MX', 'HildaRUS')"
      >
        Reproducir es-MX
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
