class GrepSed {
    constructor() {
        
    }
    
    writeSedString(sed_text_search, sed_text_to_replace, sed_file_ext, write_find_command, sed_word_bound, write_sed_file, delete_matching_line) {
        //Combine the phrase to search for and the phrase to replace to search for a delimiter
        //that is not in either one of the two prases.
        const search_phrase = sed_text_search + sed_text_to_replace;
        //Initialize message variable.
        let sed_text_message = "";
        //Set sed_text_to_replace_search_string from sed_text_to_replace parameter value.
        const sed_text_to_replace_search_string = sed_text_to_replace;

        const regex_text_to_replace = new RegExp("\\'", "g");
        //Find and replace the apostrophe in the sed_text_to_replace string and set it to sed_text_to_replace_string variable.
        const sed_text_to_replace_string = sed_text_to_replace_search_string.replace(regex_text_to_replace, "\\x27");    
        
        let sed_word_bound_string = "";
        
        if(sed_word_bound) {
            sed_word_bound_string = "\\b";
        }
        
        //Build an array to search and find a delimiter that is not found in the search string.
        const sed_delimeter_array = [
            ":",
            "/",
            "#"       
        ];

        //Initialize array for reserved characters to relace.
        //The array is empty untill we find a character that we sarch for that needs to be escaped.
        let sed_array = new Array();
        
        if(write_sed_file){
            sed_array = [       
               ["\\","\\"],         
               ["[","["],
               ["]","]"],
               [".","."],
               ["^","^"],                      
               ["*","*"],
               ["$","\$"],
               ["/","\/"],
               ["'","x27"]              
           ];       
        } else {
            sed_array = [
                ["\\","\\"],
                ["[","["],
                ["]","]"],
                ["$","\$"],
                ["'","x27"]
            ];
        }
        
        //Get array count.
        const sed_delimeter_array_count = sed_delimeter_array.length;

        //Iterate through array to find an element value that is not in the string.
        //If we find a match then use that delimeter in the sed search criteria.
        let delimiter_match = true;
        let sed_delimiter = "";
        for(let c=0; c<sed_delimeter_array_count; c++) {       
            const reg_exp = new RegExp(sed_delimeter_array[c]);             
            if(!reg_exp.test(search_phrase)) {
                sed_delimiter = sed_delimeter_array[c];
                delimiter_match = false;
                break;
            }
        }

        //Get array count.
        const sed_array_count = sed_array.length;
        //Set the sed_text_search_string = sed_text_search for building grep string.
        let sed_text_search_string = sed_text_search;
        //Iterate through array.
        for(let c=0; c<sed_array_count; c++) {
            //Get the pattern to match.
            const sed_reg_ex = "\\"+sed_array[c][0];
            //Get the value to replace.
            const sed_replace = "\\"+sed_array[c][1];
            //Build regular expresion to find match globally.
            const regex = new RegExp(sed_reg_ex, "g");
            //Replace sed_text_search_string with the value found by the reglar expression match.
            sed_text_search_string = sed_text_search_string.replace(regex, sed_replace);
        }
        
        //Add prefix word bound and suffix word bound to sed_text_search_string varaible.
        sed_text_search_string = sed_word_bound_string + sed_text_search_string + sed_word_bound_string;
        
        //Build the sed command string.
        //If write_sed_file variable is true then let the sed_text_inner_html equal a message without the sed -i prefix.
        //Otherwise add the sed -i prefix.
        if(write_sed_file && !delete_matching_line) {
            sed_text_message = "s" + sed_delimiter + sed_text_search_string + sed_delimiter+sed_text_to_replace + sed_delimiter + "g";
        } else if(write_sed_file && delete_matching_line) {
            sed_text_message = "/" + sed_text_search_string + "/d";
        } else if(!write_sed_file && delete_matching_line) {
            sed_text_message = "sed -i '/" + sed_text_search_string + "/d'";       
        } else {
            //Write string with the sed_text_to_replace_string we used above to find and replace the apostrophe with \x27.
            sed_text_message = "sed -i 's" + sed_delimiter + sed_text_search_string + sed_delimiter+sed_text_to_replace_string+sed_delimiter + "g'";
        }
        
        //Get string to add find command to build.
        if(write_find_command && write_sed_file) {
            sed_text_message = "Sed command (to copy and paste in sed.txt file:\n" + sed_text_message + "\n\nFind Command:\nfind . -type f -name '" + sed_file_ext + "' -exec sed -i -f sed.txt {} \\;";
        } else if(write_find_command && !write_sed_file) {
            sed_text_message = "find . -type f -name '" + sed_file_ext + "' -exec " + sed_text_message + " {} \\;";
        }
        
        //Return the SED command string in the inner html sed_div tag.
        //Test to see if delimiter_match is true. If it is, then we could not find
        //a delimiter in the array that wasn't in the string. This means we may have
        //to add another unique character to the array to see if we can
        //find a character that is not in the search string.
        if(delimiter_match) {
            return "There were no elements in the delimetiter array that was not in the search string.";
        } else {
            return sed_text_message; 
        }      
    }
    
    writePcReGrepString(pcregrep_sed_text, grep_multi_line, grep_case_insensitive, grep_print_maatching_only) {
         //Set the grep_inner_html = grep_text for building grep string.
        let grep_inner_html = pcregrep_sed_text;
        
        //Initialize array for reserved characters to relace.
        const grep_array = [
            ["\\","\\"], 
            ["?","?"],
            ["[","["],
            ["]","]"],
            [".","."],
            ["^","^"],
            ["(","("],
            [")",")"],
            ["|","|"],
            ["+","+"],
            ["*","*"],
            ["$","\$"],
            ["/","\/"],
            ["\r?\n","r\\n"],
            ["'","x{0027}"]      
        ];
        
        //Get array count.
        const grep_array_count = grep_array.length;       
        //Iterate through array.
        for(let c=0; c<grep_array_count; c++) {
            //Get the pattern to match.
            const grep_reg_ex = "\\"+grep_array[c][0];
            //Get the value to replace.
            const grep_replace = "\\"+grep_array[c][1];
            //Build regular expresion to find match globally.
            const regex = new RegExp(grep_reg_ex, "g");
            //Replace grep_inner_html with the value found by the reglar expression match.
            grep_inner_html = grep_inner_html.replace(regex, grep_replace);
        }
        
        //Initialize grep_switches variable.
        let grep_switches = "-";
        //Build grep switches.
        if(grep_multi_line) {
            grep_switches+= "M";
        }
        if(grep_print_maatching_only) {
            grep_switches+= "o";
        }
        if(grep_case_insensitive) {
            grep_switches+= "i";
        }
        grep_switches += "rn ";
        
        grep_inner_html = "pcregrep " + grep_switches + "'" + grep_inner_html + "' ./*";
        return grep_inner_html;       
    }
    
    writeGrepString(write_grep_find_command, grep_text, grep_file_ext, grep_perl_regex, grep_case_insensitive, grep_print_maatching_only, grep_word_bound, grep_word_count) {              
        //Set the grep_inner_html = grep_text for building grep string.
        let grep_inner_html = grep_text;

        let grep_array = new Array();    
        //Test whether Perl check box is checked.
        //If it is then use array below to replace and escape matches.
        //Other wise just use regular array for grep with Perl regex.
        if(grep_perl_regex) {
            grep_array = [
                ["\\","\\"], 
                ["?","?"],
                ["[","["],
                ["]","]"],
                [".","."],
                ["^","^"],
                ["(","("],
                [")",")"],
                ["|","|"],
                ["+","+"],
                ["*","*"],
                ["$","\$"],
                ["/","\/"],
                ["'","x{0027}"]      
            ];          
        } else {
            grep_array = [
                ["\\","\\"], 
                ["[","["],               
                [".","."],
                ["^","^"],
                ["$","\$"]
            ];
        }

        //Get array count.
        const grep_array_count = grep_array.length;       
        //Iterate through array.
        for(let c=0; c<grep_array_count; c++) {
            //Get the pattern to match.
            const grep_reg_ex = "\\"+grep_array[c][0];
            //Get the value to replace.
            const grep_replace = "\\"+grep_array[c][1];
            //Build regular expresion to find match globally.
            const regex = new RegExp(grep_reg_ex, "g");
            //Replace grep_inner_html with the value found by the reglar expression match.
            grep_inner_html = grep_inner_html.replace(regex, grep_replace);
        }
        
        //Initialize grep_switches variable.
        let grep_switches = "-";
        let grep_wc_string = "";
        let grep_file_command_string = "";
        let grep_file_command_suffix_string = "";
        let grep_wild_card_string = "";
        let grep_word_bound_string = "";
        
        if(grep_word_bound) {
            grep_word_bound_string = "\\b";
        }
        
        if(write_grep_find_command) {
            grep_file_command_string = "find . -type f -name '" + grep_file_ext + "' -exec ";
            grep_file_command_suffix_string = " {} +";
        }
        else
        {
            grep_wild_card_string = " ./*";
        }
        
        //Build grep switches.  
        if(grep_perl_regex) {
            grep_switches+= "P";
        }
        if(grep_print_maatching_only) {
            grep_switches+= "o";
        }
        if(grep_case_insensitive) {
            grep_switches+= "i";
        }       
        if(write_grep_find_command) {
            grep_switches += "n ";
        } else {
            grep_switches += "Rn ";
        }               
        if(grep_word_count) {
            grep_wc_string = " | wc -l";
        }
        
        grep_inner_html = grep_file_command_string + "grep "+grep_switches+"'" + grep_word_bound_string + grep_inner_html + grep_word_bound_string + "'" + grep_wild_card_string + grep_file_command_suffix_string + grep_wc_string;
        return grep_inner_html;
    }    
}