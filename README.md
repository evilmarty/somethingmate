# Something Mate

Code repository for the "Something Mate" project, a collection of web applications designed to assist with various tasks.

- [Date Mate](https://marty.zalega.me/datemate) - A simple date helper web app.
- [CIDR Mate](https://marty.zalega.me/cidrmate) - A CIDR calculator web app.

## Build instructions

Ensure node.js and npm is installed and configured.

```bash
git clone https://github.com/evilmarty/somethingmate.git
cd somethingmate
npm install --workspaces
npm run build --workspaces
```

## Testing

Follow the build instructions, then run:

```bash
npm run test --workspaces
```
