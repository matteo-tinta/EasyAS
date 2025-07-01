// global.d.ts
import { Container } from "inversify";
import { GenericContainer } from 'testcontainers'; // or your lib

declare global {
  // Augment globalThis with the sharedState property
  var sharedState: {
    APP_IMAGE?: GenericContainer
  };
}

export {}; // This ensures the file is treated as a module