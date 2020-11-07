<template>
  <div>
    <p>{{ text }}</p>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

@Options({})
export default class Stories extends Vue {
  // text = "When you're on the motorway, it's a good idea to use a sat-nav.";
  text = "Pórtate bien o el coco te comerá.";

  textToPitch(text: string, lang: string, voice: string): string {
    return `<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="${lang}">
              <voice name="${lang}-${voice}">
                ${text}
              </voice>
            </speak>`;
  }

  mounted(): void {
    const speechConfig = sdk.SpeechConfig.fromSubscription("8d0019b864944288bf92e53578ffc1ae", "eastus");
    // speechConfig.speechRecognitionLanguage = "es-MX";

    // const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
    // const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
    //synthesizer.speakTextAsync(

    // https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/language-support#standard-voices
    // "en-US", "JessaRUS"
    // "es-MX", "HildaRUS"

    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, undefined);
    synthesizer.speakSsmlAsync(
      this.textToPitch(this.text, "es-MX", "HildaRUS"),
      (result) => {
        if (result) {
          // console.log(JSON.stringify(result));
        }
        synthesizer.close();
      },
      (error) => {
        console.error(error);
        synthesizer.close();
      }
    );
  }
}
</script>
