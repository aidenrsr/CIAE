package model

// description of lecture video
type lecture struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	VideoURL    string `json:"vid_url"`
}
