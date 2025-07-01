import { DockerComposeEnvironment, GenericContainer, StartedTestContainer } from "testcontainers";
import path from "path";
import { beforeAll } from "vitest";

global.sharedState = {
    
}

export default async function setup() {
    console.log('🧑‍🔧 building app image...');
    
    await GenericContainer
          .fromDockerfile(path.join(__dirname, "..", ".."))
          .withBuildkit()
          .withCache(true)
          .build("easyas-test-image");
    
    console.log('✅ built!');
}