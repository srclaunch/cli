// import { spawn } from 'child_process';
// import readline from 'readline';

// export function clear() {
//   const blank = "\n".repeat(process.stdout.rows);

//   console.log(blank);
//   readline.cursorTo(process.stdout, 0, 0);
//   readline.clearScreenDown(process.stdout);
// }

// export async function restart() {
//   if (process.env.process_restarting) {
//     delete process.env.process_restarting;
//     // Give old process one second to shut down before continuing ...
//     setTimeout(restart, 1000);

//     return;
//   }

//   // ...
//   console.log("spawning");
//   // Restart process ...
//   spawn(process.argv[0], process.argv.slice(1), {
//     env: { process_restarting: "1" },
//     stdio: "ignore",
//   }).unref();
// }

export {};
