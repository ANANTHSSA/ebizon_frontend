// export const getColor = (process, maxValue) => {
//   if (process === 0) {
//     return "lightgray"; // Set background color to red when progress is 0
//   } else if (process >= maxValue) {
//     return "green"; // Set background color to green when progress equals or exceeds maxValue
//   } else if (process >= maxValue / 2) {
//     return "#ff6300"; // Set background color to orange (#ff6300) when progress is halfway
//   } else {
//     return "red"; // Default color for progress between 0 and halfway
//   }
// };

export const getMantoryCount = (process, maxValue,man) => {
  const percentage = (process / maxValue) * 100;
if(man === true){
  return ;
}
  if ((process === 0 && maxValue === 0) || percentage) {
    return (
      <>
        <img
          className="responsive-image"
          src={require(`../../src/assets/Icons/mantorySuc.png`)}
          alt="Mandatory"
          width={45}
          height={45}
        />
        <p>Mandatory</p>
      </>
    );
  } else {
    return (
      <>
        <img
          className="responsive-image"
          src={require(`../../src/assets/Icons/mantoryFail.png`)}
          alt="Mandatory"
          width={45}
          height={45}
        />
        <p>Mandatory</p>
      </>
    );
  }
};

export const getRoleName = (roleId) => {
  switch (roleId) {
    case 1:
      return "ts_admin";
    case 2:
      return "ebiz_admin";
    case 3:
      return "Architect";
    case 4:
      return "Engineer";
    default:
      return "Unknown Role";
  }
};

export const access = [
  {
      rolename: "Super Admin ",
      rights: [
          {
              list: "Full rights",
          },
      ],
  },
  {
      rolename: "Architect",
      rights: [
          {
              list: "Manage Engineer",
          },
          {
              list: "Submit Answers",
          },
          {
              list: "View Revisions",
          },
          {
              list: "Re-Open for Edit",
          },
      ],
  },
  {
      rolename: "Engineer",
      rights: [
          {
              list: "View & Edit answers",
          },
      ],
  },
];
// export const solutionName =(solution_id)=>{
//   console.log(solution_id);
//   switch(solution_id){
//     case 1:
//       return "Cloud Discovery & Assessment";
//     case 2:
//       return "Cloud Planning"
//   }
// }

export const checkPasswordStrength = (password) => {
  const regexLowercase = /[a-z]/;
  const regexUppercase = /[A-Z]/;
  const regexDigit = /\d/;
  const regexSpecial = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/;

  let score = 0;

  if (password.length >= 8) {
    score++;
  }

  if (regexLowercase.test(password)) {
    score++;
  }

  if (regexUppercase.test(password)) {
    score++;
  }

  if (regexDigit.test(password)) {
    score++;
  }

  if (regexSpecial.test(password)) {
    score++;
  }

  return score;
};

export const isFieldEmpty = (value) => {
  return value === undefined || value === null || value.trim() === "";
};

export const isValidEmail = (email) => {
  // You can use a regular expression for basic email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

export const validateFields = (editUserInfo) => {
  const errors = {};

  if (isFieldEmpty(editUserInfo?.user_name)) {
    errors.user_name = "Please enter a valid user name";
  }

  if (isFieldEmpty(editUserInfo?.company_name)) {
    errors.company_name = "Please enter a valid company name";
  }

  if (isFieldEmpty(editUserInfo?.email_id)) {
    errors.email_id = "Please enter a valid email address";
  } else if (!isValidEmail(editUserInfo?.email_id)) {
    errors.email_id = "Please enter characters in email address";
  }
  return errors;
};

export const passwordCheck =(editUserInfo)=>{
  const errors = {};
   const password = editUserInfo?.password || "";
  if (isFieldEmpty(password) || password.length < 8) {
    errors.password = "Password must be at least 8 characters long";
    
  }
}
