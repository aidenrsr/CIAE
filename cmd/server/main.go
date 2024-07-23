package main

import {
	"net/https"

	"github.com/gin-gonic/gin"
}

func main() {
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(https.StatusOK, gin.H{
			"message": "pong"
		})
	})
	r.Run()
}
