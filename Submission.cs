public class Submission
{
    public int Id { get; set; }
    public string? status {get; set;} // Received, Saved, Sent, Failed
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Product { get; set; }
    public string? Size { get; set; }
    public int? Quantity { get; set; }
    public string? Location { get; set; }
    public string? message { get; set; }
    public string? Image1 { get; set; }
    public string? Image2 { get; set; }
    public string? Image3 { get; set; }
    public string? Image4 { get; set; }
    public bool submit { get; set; }

}