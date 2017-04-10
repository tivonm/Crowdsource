function validate() {
    var date = new Date()
    if(document.submitProjectForm.projectName.value==""){
            alert("Must provide a project name");
            document.submitProjectForm.projectName.focus();
            return false;
    } else if (((document.submitProjectForm.projectName.value.length)< 5) || ((document.submitProjectForm.projectName.value.length) > 20)){
            alert("Project name must be between Five and Twenty Characters.");
            return false;
    } 
    if(document.submitProjectForm.projectDescription.value==""){
            alert("Must provide a project description");
            document.submitProjectForm.projectDescription.focus();
            return false;
    } else if (((document.submitProjectForm.projectDescription.value.length)< 10) || ((document.submitProjectForm.projectName.value.length) > 150)){
            alert("Project Description must be between ten and 150 Characters.");
            return false;
    } 


    return (true);
}