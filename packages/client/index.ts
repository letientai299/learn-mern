for (const key in process.env) {
  console.log(`${key.padEnd(30)}: ${process.env[key]}`)
}

console.log("client ts file")
