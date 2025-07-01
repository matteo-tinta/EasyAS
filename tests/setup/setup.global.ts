import { DockerComposeEnvironment, GenericContainer, StartedTestContainer } from "testcontainers";
import path from "path";
import { beforeAll } from "vitest";

global.sharedState = {
    
}

beforeAll(async () => {
    console.log('🧑‍🔧 building app image...');
    
    global.sharedState.APP_IMAGE = await GenericContainer
          .fromDockerfile(path.join(__dirname, "..", ".."))
          .withBuildkit()
          .withCache(true)
          .build();
    
    console.log('✅ built!');
}, 1000 * 40)

export default async function setup() {
    console.log('🌍 Global setup running...');
}