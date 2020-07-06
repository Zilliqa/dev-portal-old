---
id: dev-tools-ide
title: Scilla IDEs
---

## Neo-Savant @ [https://ide.zilliqa.com](https://ide.zilliqa.com/)

![Txn sharding](../assets/application/tools/neosavant.png)

A fully-fledged IDE used for writing, testing and deploying Scilla smart contracts painlessly. It can be tried out at https://ide.zilliqa.com/.

Neo-Savant helps Scilla developers to create and deploy Smart Contracts using an automated development environment, in-browser, with quick and intuitive controls.

### Features
* Intuitive UI for easy deployment/contract invocation.
* Multiple networks supported: Testnet, Mainnet and a Simulated Environment where you can test out contracts without spending $ZIL
* Account management using Keystore, Ledger or ZilPay.
* Simple, persistent file manager for managing your contracts that allows for renaming/deletion.
* Possibility to import already deployed contracts and call their transitions.
* Support for event in contracts, with automatic notifications in the UI.
* Support for arbitrary gas price/gas limit in deployment/calls.

## VSCode extension by [as1ndu](https://marketplace.visualstudio.com/publishers/as1ndu)

### Installation

**Method 1:** Install directly from [VS Marketplace](https://marketplace.visualstudio.com/items?itemName=as1ndu.scilla)
- Launch VS Code Quick Open (Ctrl+P),
- Use the following command
```
ext install as1ndu.scilla
```

**Method 2:** Manual install using VS Code extension package
- Download the `.visx` file from the [releases tab](https://github.com/as1ndu/scilla/releases)
- Using the Install from VSIX command in the Extensions view command drop-down,: Install from VSIX command in the Command Palette, point to the `.vsix` file.

### Features
- Syntax highlighting
- Code Snippets
- Debugging (Error & Warnings)
- Cash Flow Analysis (`ctrl + P` then `>` type `scilla` then select `Scilla: Cashflow Analyser`)
- Gas Usage Reports (Enable it in extension settings)
- Type info for variables (Hover over dotted lines to see they type information of a variable)
- Configuration via Vscode's UI

## Vim
A vim plugin for editing Scilla contracts is provided.

You can install the vim config files through Pathogen by:
```
git clone https://github.com/edisonljh/vim-scilla.git ~/.vim/bundle/vim-scilla
```
Or through Vundle by adding the following line to your `~/.vimrc`:
```
Plugin 'edisonljh/vim-scilla'
```

If you are using [ALE](https://github.com/w0rp/ale), you can enable [scilla-checker](https://scilla.readthedocs.io/en/latest/scilla-checker.html) to show errors right inside vim.

Here is how to enable it:

1. Install [ALE](https://github.com/w0rp/ale) vim plugin
2. Make `scilla-checker` executable available (https://github.com/Zilliqa/scilla#compiling-and-running)
3. Set STDLIB dir in vimrc: `let g:ale_scilla_checker_libdir = '<path>/stdlib'`
4. Set CHECKER in vimrc: ` let g:ale_scilla_checker_executable='<path>/scilla-checker'`
5. Enable the linter in vimrc: `autocmd FileType scilla let b:ale_linters = ['checker']`
6. Open any scilla file and ensure checker is working: `:ALEInfo`
Repo: [vim-scilla](https://github.com/edisonljh/vim-scilla).

## Emacs
An emacs major mode for editing Scilla contracts is [provided](https://github.com/Zilliqa/scilla/blob/master/misc/emacs-mode/scilla-mode.el).
Add the following line to your `.emacs` file to load this mode for files ending with `.scilla` and `.scillib`.
For enabling flycheck mode for Scilla (see [INSTALL.md](https://github.com/Zilliqa/scilla/blob/master/INSTALL.md)). When `scilla-checker` is available,
type reporting is also supported. The key binding `C-c C-t` will print the type of the variable on which
the cursor currently is.

```
;; For enabling flycheck mode for Scilla.
(setq scilla-root "/path/to/scilla/root")
;; Scilla mode
(load-file "/path/to/scilla-mode.el")
