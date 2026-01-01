document.addEventListener("DOMContentLoaded", init_grepsed, false);

function init_grepsed() {       
   let get_string_grep = document.getElementById("get_string_grep");
   let get_string_sed = document.getElementById("get_string_sed");
   
   if(get_string_grep) {
        get_string_grep.addEventListener("click", function (e) {
            writeGrepString(e);
        }, false);            
   } 
   
   if(get_string_sed) {
        get_string_sed.addEventListener("click", function (e) {
            writeSedString(e);
        }, false);            
   }   
}  

function writeSedString(event) { 
    let write_find_command = document.getElementById("write_find_command").checked;
    let sed_word_bound = document.getElementById("sed_word_bound").checked;   
    let write_sed_file = document.getElementById("write_sed_file").checked;
    let delete_matching_line = document.getElementById("delete_matching_line").checked;
    
    let sed_text_search = document.getElementById("sed_text_to_search").value;
    let sed_text_to_replace = document.getElementById("sed_text_to_replace").value;
    let sed_file_ext = document.getElementById("sed_file_ext").value;
    
    let gs = new GrepSed();
    
    let message = gs.writeSedString(sed_text_search, sed_text_to_replace, sed_file_ext, write_find_command, sed_word_bound, write_sed_file, delete_matching_line);
     
    //Print the inner html message.    
    document.getElementById("sed_div").innerText = message;  
}

function writeGrepString(event) {
    let grep_text = document.getElementById("grep_sed_text").value;
    let pcregrep_sed_text = document.getElementById("pcregrep_sed_text").value;
    
    //Check to see if both text box and text aread have information in it.
    //If so, then alert the person and exit.
    if(!checkForValidGrepForm(grep_text, pcregrep_sed_text)) {
        event.preventDefault();
        return false;
    }
    
    let grep_file_ext = document.getElementById("grep_file_ext").value;
    let grep_case_insensitive = document.getElementById("grep_case_insensitive").checked;
    let write_grep_find_command = document.getElementById("write_grep_find_command").checked;    
    let grep_print_maatching_only = document.getElementById("grep_print_maatching_only").checked;
    let pcregrep_case_insensitive = document.getElementById("pcregrep_case_insensitive").checked;
    let pcregrep_print_maatching_only = document.getElementById("pcregrep_print_maatching_only").checked;
    let grep_perl_regex = document.getElementById("grep_perl_regex").checked;
    let pcregrep_multi_line = document.getElementById("pcregrep_multi_line").checked;
    let grep_word_bound = document.getElementById("grep_word_bound").checked;    
    let grep_word_count = document.getElementById("grep_word_count").checked;   
    
    //Test for a single quote to test for whether to use a Perl expression or not.
    if(!grep_perl_regex && grep_text.match("'")) {
        alert("You have a single quote in your Grep search and have selected not to use Perl RegEx.\nPlease check the Perl check box to search for a single quote.");
        event.preventDefault();
        return false;
    }   

    let gs = new GrepSed();
    let message = "";
    
    if(grep_text !== "") {
        message = gs.writeGrepString(write_grep_find_command, grep_text, grep_file_ext, grep_perl_regex, grep_case_insensitive, grep_print_maatching_only, grep_word_bound, grep_word_count);
    } else if(grep_print_maatching_only !== "") {
        message = gs.writePcReGrepString(pcregrep_sed_text, pcregrep_multi_line, pcregrep_case_insensitive, pcregrep_print_maatching_only);
    }

    //Print out the grep command string in the inner html grep_div tag.
    document.getElementById("grep_div").innerText = message;    
}

function checkForValidGrepForm(grep_text, pcregrep_sed_text) {
    if(grep_text !== "" && pcregrep_sed_text !== "") {
        alert("You can not have text in both the Grep Input Box and the Pcregrep Text Area Box.\nPlease choose one or the other.")
        return false;
    } else if(grep_text === "" && pcregrep_sed_text === "") {
        alert("You must have text in either the Grep Input Box or the Pcregrep Text Area Box.\nPlease enter text in either of the two boxes to submit the form.")
        return false;
    }
    return true;
}