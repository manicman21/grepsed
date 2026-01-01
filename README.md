# grepsed
A page to help you create a grep or sed command line

Before you start, always backup your workspace!!!

When using SED to get an exact match use word bound check box.
For example if you are searching for "MyText" and want to replace with "YourText" and you have a phrase that says MyTextExtraCharacters and you use SED command without word boundry it will find MyText and MyTextExtraCharacters and replace with YourText. However if you use word boundry then it will only find the occurence of the phrase MyText and not MyTextExtraCharacters. Only replacing MyText with YourText and leaving MyTextExtraCharacters unchanged.

Please note, use with caution as it has not been fully tested for every possible scenario.
Like all coding, there may exists bugs that have been caught and managed.

If you find a bug, please create an issue.

Please feel free to modify code, to meet your needs.
Respect the authors creativity and do not take credit for this code.
