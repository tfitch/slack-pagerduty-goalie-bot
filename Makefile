clean: ## clean up
	@rm -rf *.zip node_modules

package: clean ## prepare the package
	@npm install
	@zip -r lambda-slack-pagerduty-goalie-bot.zip *.js .env node_modules

lambda: package ## deploy the package to Lambda, intended for development only. Use Terraform for real. Also, does not create the function.
	@aws lambda update-function-code --function-name slack-pagerduty-goalie-bot-lambda --zip-file fileb://lambda-slack-pagerduty-goalie-bot.zip --publish

.PHONY: help
.DEFAULT_GOAL := help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
