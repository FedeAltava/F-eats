import { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { FirebaseUserRepository } from "../../infrastructure/repositories/FirebaseUserRepository";
import { CreateUser } from "../../application/use-cases/user/CreateUserUse-case";
import { User } from "../../domain/entities/User";
import { useNavigate } from "react-router-dom";
import { orange } from "@mui/material/colors";

export const RegisterUser = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  const title = "Register User";
  const len = title.length;
  const handleRegister = async () => {
    try {
      const user = User.create({ name, email, password });
      const userRepository = new FirebaseUserRepository();
      const createUser = new CreateUser(userRepository);
      await createUser.execute(user);
      setFeedback("✅ User successfully registered.");
      setName("");
      setEmail("");
      setPassword("");
      navigate("/login");
    } catch (error) {
      setFeedback(`❌ ${error}`);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" gap={2} mt={5}>
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{
            color: orange[600],
            fontFamily: "Courier, monospace",
            whiteSpace: "nowrap",
            overflow: "hidden",
            width: 0,
            mx: "auto",
            "@keyframes typing": {
              from: { width: 0 },
              to: { width: `${len}ch` },
            },
            "@keyframes blink": {
              "0%, 49%": { borderColor: "transparent" },
              "50%, 100%": { borderColor: orange[600] },
            },
            animation: `typing 2s steps(${len}) forwards`,
          }}
        >
          Register User
        </Typography>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" onClick={handleRegister}>
          Register
        </Button>
        {feedback && <Typography align="center">{feedback}</Typography>}
      </Box>
    </Container>
  );
};
