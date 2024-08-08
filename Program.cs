using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<SubmissionDb>(opt => opt.UseInMemoryDatabase("TodoList"));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument(config =>
{
    config.DocumentName = "QLP Quote Service";
    config.Title = "QLP Quote Service v1";
    config.Version = "v1";
});
var emailPassword = builder.Configuration["Email:Password"];
var app = builder.Build();


    app.UseOpenApi();
    app.UseSwaggerUi(config =>
    {
        config.DocumentTitle = "TodoAPI";
        config.Path = "/swagger";
        config.DocumentPath = "/swagger/{documentName}/swagger.json";
        config.DocExpansion = "list";
    });

app.MapGet("/submissions", async (SubmissionDb db) =>
    await db.Submissions.ToListAsync());

app.MapGet("/submissions/failed", async (SubmissionDb db) =>
    await db.Submissions.Where(s => s.status == "failed").ToListAsync());


// Create searchable field
// app.MapGet("/submissions/{field}/{search}", async (int id, SubmissionDb db) =>
//     await db.Submissions.FindAsync(id)
//         is Submission todo
//             ? Results.Ok(todo)
//             : Results.NotFound());

app.MapPost("/submission", async (Submission submission, SubmissionDb db) =>
{
    db.Submissions.Add(submission);
    await db.SaveChangesAsync();

    var mailService = new MailService();
    mailService.SendNewEmail(submission, emailPassword);

    return Results.Created($"/submission/{submission.Id}", submission);
});

app.MapPut("/submission/{id}", async (int id, Submission inputSubmission, SubmissionDb db) =>
{
    var activeSubmission = await db.Submissions.FindAsync(id);

    if (activeSubmission is null) return Results.NotFound();

    activeSubmission = inputSubmission;

    await db.SaveChangesAsync();

    return Results.NoContent();
});

// Add delete method / cron job that empties records every 30 days

app.Run();