/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { orange } from "@mui/material/colors";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { FirebaseRestaurantRepository } from "../../infrastructure/repositories/FirebaseRestaurantRepository";
import { UpdateRestaurant } from "../../application/use-cases/restaurant/UpdateRestaurantUse-case";
import { Restaurant } from "../../domain/entities/Restaurant";
import { RestaurantUpdateData } from "../../domain/entities/Restaurant";

export const ProfileRestaurant: React.FC = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const uid = localStorage.getItem("uid");
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const title = "Restaurants";
  const len = title.length;

  useEffect(() => {
    (async () => {
      if (!uid) {
        navigate("/login-restaurant");
        return;
      }
      const repo = new FirebaseRestaurantRepository();
      const r = await repo.getById(uid);
      if (!r) {
        navigate("/login-restaurant");
        return;
      }
      setRestaurant(r);

      setName(r.name.value);
      setEmail(r.email.value);
      setCategory(r.category.value);
      setRating(r.rating.value);
      setImageUrl(r.imageUrl.value);
    })();
  }, [uid, navigate]);


  const handleSave = async () => {
    setError(null);
    setFeedback(null);
    if (!restaurant) return;

    const data: RestaurantUpdateData = {};
    if (name !== restaurant.name.value) data.name = name;
    if (passwordInput.trim().length > 0) data.password = passwordInput;
    if (category !== restaurant.category.value) data.category = category;
    if (rating !== restaurant.rating.value) data.rating = rating;
    if (imageUrl !== restaurant.imageUrl.value) data.imageUrl = imageUrl;

    if (Object.keys(data).length === 0) {
      setFeedback("No changes to save.");
      return;
    }

    setLoading(true);
    try {
      const repo = new FirebaseRestaurantRepository();
      const uc = new UpdateRestaurant(repo);
      await uc.execute(uid!, data);

      if (data.name) localStorage.setItem("name", data.name);
      setFeedback("Profile updated successfully.");
      setPasswordInput("");
    } catch {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };


  const handleChangePassword = async () => {
    setError(null);
    setFeedback(null);

    if (!restaurant) return;
    const currentEmail = restaurant.email.value;

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, currentEmail);
      setFeedback("A password-reset link has been sent to your email.");
      setPasswordInput("");
    } catch (err: any) {
      setError(err.message || "Failed to send password-reset email");
    } finally {
      setLoading(false);
    }
  };

  if (!restaurant) return null;

  return (
    <Container maxWidth="sm">
      <Box mt={5} display="flex" flexDirection="column" gap={2}>
        <Typography  variant="h2"
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
        }}>
          Edit Restaurant
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {feedback && <Alert severity="success">{feedback}</Alert>}

        <TextField
          label="Email"
          type="email"
          value={email}
          disabled
          fullWidth
        />


        <Box display="flex" alignItems="center" gap={1}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <Button
            variant="outlined"
            onClick={handleSave}
            disabled={loading}
          >
            Change Name
          </Button>
        </Box>


        <Box display="flex" alignItems="center" gap={1}>
          <TextField
            label="(Enter current password to reset)"
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            helperText="Leave blank to skip"
            fullWidth
          />
          <Button
            variant="outlined"
            onClick={handleChangePassword}
            disabled={loading}
            sx={{ mb: 3 }}
          >
            Change Password
          </Button>
        </Box>


        <TextField
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          fullWidth
        />


        <TextField
          label="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          fullWidth
        />

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving…" : "Save Changes"}
        </Button>
      </Box>
    </Container>
  );
};
