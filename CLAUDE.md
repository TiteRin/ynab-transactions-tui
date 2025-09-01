# CLAUDE.md

## Project Overview
A simple TUI application to help an user clear or categorize their last transactions in You Need A Budget (YNAB), using YNAB API

## Development Guidelines
- The project will be written in Typescript, and use Ink to create its UI
- The project will follow TDD guidelines and targets a 95% test coverage

## How to use
- in a terminal, you’ll execute ./ynab-transactions
- if a transaction is linked to a category and you agree with it, you can clear it by typing Enter or c when highlighting the line
- else, you can change the category with the arrow UP or DOWN
- when you’re satisfied with your modifications, you can send them with the button "Clear"
- else, you can reset with the button "Reset"
