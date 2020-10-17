#!/usr/bin/env node
import inquirer from "inquirer";
import axios from "axios";
import boxen, { BorderStyle } from "boxen";
import chalk from "chalk";

const log = console.log;

log(
  boxen(
    chalk.blue(`
██████╗ ██╗██╗   ██╗███████╗██████╗ ████████╗
██╔══██╗██║██║   ██║██╔════╝██╔══██╗╚══██╔══╝
██║  ██║██║██║   ██║█████╗  ██████╔╝   ██║   
██║  ██║██║╚██╗ ██╔╝██╔══╝  ██╔══██╗   ██║   
██████╔╝██║ ╚████╔╝ ███████╗██║  ██║   ██║   
╚═════╝ ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝   ╚═╝   
`),
    { padding: 1, margin: 1, borderStyle: BorderStyle.Double }
  )
);

inquirer
  .prompt([
    {
      type: "list",
      message: "What would you like to do?",
      name: "option",
      choices: [
        "Add a new URL",
        "View list of shortened URLs",
        "Update a shortened URL",
        "Delete a shortened URL",
      ],
    },
  ])
  .then((answers) => {
    // add URL
    if (answers.option === "Add a new URL") {
      // get values
      inquirer
        .prompt([
          {
            type: "input",
            name: "original_url",
            message: "What's the URL you'd like to shorten?",
          },
          {
            type: "input",
            name: "shortened_url_code",
            message: "What code would you like to assign?",
          },
        ])
        .then((answers) => {
          // request
          axios
            .post("http://dsckiit-divert.herokuapp.com/api/createURL", answers)
            .then((resp) => {
              log(
                chalk.greenBright(`Saved in DB with id ${resp.data.message}`)
              );
            })
            .catch((err) =>
              log(
                chalk.redBright(`
          We encountered the following error:  ${err}. 
          Please try again later!`)
              )
            );
        });
    }
    // view URL
    else if (answers.option === "View list of shortened URLs") {
      axios
        .get("http://dsckiit-divert.herokuapp.com/api/getAllURL")
        .then((resp) => {
          console.table(resp.data, [
            "shortened_url_code",
            "original_url",
            "click_count",
          ]);
        })
        .catch((err) =>
          log(
            chalk.redBright(`
      We encountered the following error:  ${err}. 
      Please try again later!`)
          )
        );
    }
    // update URL
    else if (answers.option === "Update a shortened URL") {
      // get list to show user
      axios
        .get("http://dsckiit-divert.herokuapp.com/api/getAllURL")
        .then((resp) => {
          console.table(resp.data, [
            "_id",
            "shortened_url_code",
            "original_url",
          ]);
          // after showing
          inquirer
            .prompt([
              {
                type: "input",
                name: "_id",
                message:
                  "From the above list, enter the id of the URL you want to update",
              },
              {
                type: "input",
                name: "original_url",
                message:
                  "Enter new url, or the same one if there are no changes",
              },
              {
                type: "input",
                name: "shortened_url_code",
                message:
                  "Enter new short code, or the same one if there are no changes",
              },
            ])
            // update with inputs
            .then((answers) => {
              axios
                .post(
                  "http://dsckiit-divert.herokuapp.com/api/updateURL",
                  answers
                )
                .then(() => {
                  log(chalk.greenBright("URL has been updated"));
                })
                .catch((err) =>
                  log(
                    chalk.redBright(`
              We encountered the following error:  ${err}. 
              Please try again later!`)
                  )
                );
            });
        })
        .catch((err) =>
          log(
            chalk.redBright(`
      We encountered the following error:  ${err}. 
      Please try again later!`)
          )
        );
    }
    // delete a URL
    else if (answers.option === "Delete a shortened URL") {
      // get list to show user
      axios
        .get("http://dsckiit-divert.herokuapp.com/api/getAllURL")
        .then((resp) => {
          console.table(resp.data, [
            "_id",
            "shortened_url_code",
            "original_url",
          ]);

          inquirer
            .prompt({
              type: "input",
              name: "_id",
              message:
                "From the above list, enter the id of the URL you want to delete",
            })
            .then((answers) => {
              // delete request
              axios
                .post(
                  "http://dsckiit-divert.herokuapp.com/api/deleteURL",
                  answers
                )
                .then(() => {
                  log(chalk.greenBright("URL has been deleted from DB"));
                })
                .catch((err) =>
                  log(
                    chalk.redBright(`
              We encountered the following error:  ${err}. 
              Please try again later!`)
                  )
                );
            });
        });
    }
  })
  // handle first inquire error
  .catch((err) =>
    log(
      chalk.redBright(`
  We encountered the following error:  ${err}. 
  Please try again later!`)
    )
  );
