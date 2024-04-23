'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

type ModalProps = {
  message: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function FeedbackModal({ message, open, setOpen }: ModalProps) {
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="response-modal-title"
        aria-describedby="response-modal-message"
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: 'absolute' as const,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="response-modal-message" sx={{ mt: 2 }}>
              {message}
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
